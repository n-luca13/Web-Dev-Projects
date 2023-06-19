<?php
    header("Access-Control-Allow-Origin: https://phasesband.altervista.org/");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: GET");

    function encrypt($value, $key) {
        $ivLength = openssl_cipher_iv_length('aes-256-cbc');
        $iv = openssl_random_pseudo_bytes($ivLength);
        $encryptedValue = openssl_encrypt($value, 'aes-256-cbc', $key, OPENSSL_RAW_DATA, $iv);
        $encryptedValue = base64_encode($iv . $encryptedValue);
        return $encryptedValue;
    }

    function decrypt($encryptedValue, $key) {
        $encryptedValue = base64_decode($encryptedValue);
        $ivLength = openssl_cipher_iv_length('aes-256-cbc');
        $iv = substr($encryptedValue, 0, $ivLength);
        $encryptedValue = substr($encryptedValue, $ivLength);
        $decryptedValue = openssl_decrypt($encryptedValue, 'aes-256-cbc', $key, OPENSSL_RAW_DATA, $iv);
        return $decryptedValue;
    }

    function sendErrorMail($message) {
        $to = 'phasesacoustic@gmail.com';
        $subject = "Sito Phases - Errore API Instagram";
        mail($to, $subject, $message);
    }

    $filePath = '*****';
    $encryptionKey = '*****';

    // Lettura del file
    $fileContent = file_get_contents($filePath);
    if(empty($fileContent)){
        http_response_code(500);
        exit;
    }

    // Distinzione di token cifrato e data di emissione
    list($encryptedToken, $emissionDate) = explode(',', $fileContent);
        
    // Decifratura
    $token = decrypt($encryptedToken, $encryptionKey);

    // Calcolo dei giorni trascorsi dalla data di emissione (min 1, max 60)
    $currentDate = date('Y-m-d');
    $dateDiff = date_diff(date_create($emissionDate), date_create($currentDate))->days;

    // Se sono stati superati i 30 giorni dalla data di emissione del token...
    if ($dateDiff > 30) {
        // Richiesta all'API di Instagram per il REFRESH del token di lungo periodo
        $url = 'https://graph.instagram.com/refresh_access_token';
        $params = array(
            'grant_type' => 'ig_refresh_token',
            'access_token' => $token
        );

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url . '?' . http_build_query($params));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        $response = json_decode($response, true);
        if (isset($response['access_token'])){
            // Se si è ricevuto il nuovo token, procedere con la cifratura e l'inserimento nel file dedicato
            $token = $response['access_token'];
            $encryptedToken = encrypt($token, $encryptionKey);
            $emissionDate = $currentDate;
            $fileContent = $encryptedToken . ',' . $emissionDate;
            file_put_contents($filePath, $fileContent);
        } else {
            // SEGNALAZIONE ALL'AMMINISTRATORE
            $msg = "Impossibile richiedere il refresh del token di lungo periodo";
            sendErrorMail($msg);
        }
    }

    if (isset($token) && $dateDiff <= 60) {   
        // Richiesta all'API di Instagram per i contenuti multimediali
        $url = 'https://graph.instagram.com/me/media';
        $params = array(
            'fields' => 'media_type, media_url, permalink, thumbnail_url',
            'access_token' => $token
        );

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url . '?' . http_build_query($params));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        // Restituzione dei dati come risposta JSON
        http_response_code(200);
        header('Content-Type: application/json');
        echo $response;
    } else {
        // Si è verificato un errore durante l'ottenimento del token di accesso
        // SEGNALAZIONE ALL'AMMINISTRATORE
        $msg = "Impossibile effettuare richiesta di contenuti multimediali: token ignoto o scaduto";
        sendErrorMail($msg);
        http_response_code(503);
    }
?>