<?php
    Class Mail extends Core{
        public function __construct(){
            parent::__construct();

            $this->init(array(
                'name'  => 'mail',
                'title' => 'Отправка почты'
            ));
        }

        public function send($from_name, $from_mail, $to, $subject, $template, $data){
            $subject_h = "=?utf-8?b?" . base64_encode($subject) . "?=";
            $from = "=?utf-8?B?" . base64_encode($from_name) . "?= <".$from_mail.">";

            $headers  = 'MIME-Version: 1.0' . "\n";
            $headers .= 'Content-type: text/html; charset=utf-8' . "\n";
            $headers .= 'Content-Transfer-Encoding: 8bit' . "\n";

            // Additional headers
            $headers .= 'To: <'.$to.'>' . "\n";
            $headers .= 'From: '.$from. "\n";

            if(!$template){
                $content_to_send = $data;
            }else{
                $this->smarty->assign('mail_vars', $data);
                $content = $this->smarty->fetch($template);

                $mail_vars = array(
                    'content' => $content,
                    'subject' => $subject
                );

                $this->smarty->assign('mail_vars', $mail_vars);
                $content_to_send = $this->smarty->fetch('mailing.tpl');
            };

            return mail($to, $subject_h, $content_to_send, $headers);
        }
    }
?>