<?php
    header("Access-Control-Allow-Origin: ../contatti.html");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");

    // FORBIDDEN -- REDIRECT
    if(!file_get_contents('php://input')){
        http_response_code(403);
        header("location: ../homepage.html");
        exit;
    };

    $userData = (array)json_decode(file_get_contents('php://input'));
    $emptyFields = [];
    $errorsArray = [];

    // VERIFICA CAMPI VUOTI - BAD REQUEST (CAMPI VUOTI)
    foreach($userData as $key => $value){
        if(empty($value) || ctype_space($value)) {$emptyFields[] = $key;}
    };
    if(!empty($emptyFields)){
        http_response_code(400);
        echo json_encode(array("emptyFields" => $emptyFields));
        return;
    };

    // CREAZIONE E SANIFICAZIONE VARIABILI EMAIL
    $to = 'phasesacoustic@gmail.com';
    $from = $userData["email"];
    if(strstr($from, PHP_EOL)) {
        http_response_code(400);
        return;
    };
    $from = filter_var($from, FILTER_SANITIZE_EMAIL);
    if(!filter_var($from, FILTER_VALIDATE_EMAIL)){
        $errorsArray["email"] = "Formato non valido";
        echo json_encode(array("errorsArray" => $errorsArray));
        http_response_code(400);
        return;
    };
    $subject = str_ireplace(array("\r", "\n", '%0A', '%0D'), '', $userData["oggetto"]);
    $message = $userData["messaggio"]; 
    $message = wordwrap($message, 70, "\r\n");
    $headers = array(
        'Content-Type' => 'text/plain; charset=utf-8',
        'From' => $from, 
        'Reply-To' => $from
    );

    // CODIFICA ENTITA' HTML PER SUCCESSIVO DISPLAY NEL FRONT-END
    foreach($userData as $key => $val){
        $userData[$key] = htmlentities($val, ENT_QUOTES, 'UTF-8');
    };

    // ABSTRACT API: VALIDAZIONE MAIL | GRATUITO FINO A 100 CHIAMATE AL MESE
    $api_key = "*****";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://emailvalidation.abstractapi.com/v1/?api_key=$api_key&email=$from");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    $response = curl_exec($ch);
    curl_close($ch);
    $data = json_decode($response, true);

    //VERIFICA ASSENZA ERRORI ABSTRACT - INTERNAL SERVER ERROR & SEGNALAZIONE
    if(isset($data["error"]["code"])){
        http_response_code(500);
        $subject = "Sito Phases - Errore Invio E-Mail";
        $message = wordwrap($data["error"]["code"], 70, "\r\n");
        mail($to, $subject, $message);
        echo json_encode(array("userData" => $userData));
        return;
    };

    // VERICA FORMATO E ATTENDIBILITA' INDIRIZZO - BAD REQUEST (FORMATO NON VALIDO)
    if($data['is_valid_format'] == FALSE || $data['deliverability'] == "UNDELIVERABLE"){
        $errorsArray["email"] = "Formato non valido";
        echo json_encode(array("errorsArray" => $errorsArray));
        http_response_code(400);
        return;
    };
    
    // Abstract's evaluation of the deliverability of the email. Possible values are: DELIVERABLE, UNDELIVERABLE, RISKY, and UNKNOWN
    // EMAIL RISCHIOSA
    if($data['deliverability'] == "RISKY"){
        $subject = "MAIL RISCHIOSA - " . $subject;
    };

    // INVIO EMAIL
    if(mail($to, $subject, $message, $headers)){
        http_response_code(200);
        echo json_encode($userData);
    }else{
        $subject = "Sito Phases - Errore Invio E-Mail";
        $message = "Controllare il funzionamento di mail()";
        mail($to, $subject, $message);
        http_response_code(500);
        echo json_encode(array("userData" => $userData));
    };
?>