<?php

Class Feedback extends Core
{
    public function __construct()
    {
        parent::__construct();

        $this->init(array(
            'name' => 'about.feedback',
            'title' => 'Обратная связь',
            'dir' => '/control/about/feedback',
            'static_content' => $this->getStaticContent()
        ));
    }

    public function __destruct()
    {
        $this->deInit();
    }

    private function getStaticContent()
    {
        $html = <<<EOF

EOF;

        return $html;
    }
}