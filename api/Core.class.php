<?php

Class Core
{
    protected
        $template = 'main.tpl',
        $ajax_mode = false;

    public
        $config,
        $module = array(
        'form' => false, // TODO: Нужен ли этот индекс? Вроде больше нигде не используется
        'header_additional' => false
    ),
        $main_menu = array(
        array('name' => 'settings', 'title' => 'Настройка'),
        array('name' => 'map', 'title' => 'Карта')
    ),
        $uri;

    // Классы API
    private $classes = array(
        'utils' => 'Utilities',
        'db' => 'Database',
        'auth' => 'Auth',
        'mail' => 'Mail',
        'form' => 'Form',
        'devices' => 'Devices',
        'eventsApi' => 'EventsApi',
        'payment' => 'Payment'
    );

    // Созданные объекты
    private static $objects = array();

    public function __construct()
    {
        require_once($_SERVER['DOCUMENT_ROOT'] . '/Config.class.php');
        $this->config = new Config();
        $this->setUriData();
    }

    public function __get($name)
    {
        // Если такой объект уже существует, возвращаем его
        if (isset(self::$objects[$name])) {
            return (self::$objects[$name]);
        }

        // Если запрошенного API не существует - ошибка
        if (!array_key_exists($name, $this->classes)) {
            return null;
        }

        // Определяем имя нужного класса
        $class = $this->classes[$name];

        // Подключаем его
        include_once($_SERVER['DOCUMENT_ROOT'] . '/api/' . $class . '.class.php');

        // Сохраняем для будущих обращений к нему
        self::$objects[$name] = new $class();

        // Возвращаем созданный объект
        return self::$objects[$name];
    }

    //Функция запуска приложения
    protected function init($module)
    {
        $this->module = array_merge($this->module, $module);

        //Если в запросе присутствует переменная ajax, ставим режим аякса
        if (isset($_GET['ajax'])) {
            $this->ajax_mode = true;
        }

        require_once($_SERVER['DOCUMENT_ROOT'] . '/smarty/Smarty.class.php');

        //Подключаем и запускаем Смарти
        $this->smarty = new Smarty();

        $this->smarty->setTemplateDir($_SERVER['DOCUMENT_ROOT'] . '/control/templates');
        $this->smarty->setCompileDir($_SERVER['DOCUMENT_ROOT'] . '/control/templates_c');
        $this->smarty->setConfigDir($_SERVER['DOCUMENT_ROOT'] . '/smarty/configs');
        $this->smarty->setCacheDir($_SERVER['DOCUMENT_ROOT'] . '/cache');

        $this->smarty->force_compile = true; //TODO: снять принудительную компиляцию
        $this->smarty->debugging = false;
        $this->smarty->caching = false;
        $this->smarty->cache_lifetime = 120;

        //Ставим пользовательскую таймзону
        if (isset($this->auth->user['data']['user_timezone'])) {
            date_default_timezone_set($this->auth->user['data']['user_timezone']);
        }

        if (!$this->auth->user['status'] && $this->uri != '/control/auth/login/') {
            $return = '?return='.urlencode($_SERVER['REQUEST_URI']);
            header('Location: /control/auth/login' . $return);
        }
    }

    //Функция окончания работы приложения
    protected function deInit()
    {
        $this->renderPage();
        $this->db->mySqlDisconnect();
    }

    //Отправка переменных в шаблон и отрисовка страницы
    private function renderPage()
    {
        //Если не включен режим аякса, отрисовываем страницу с помощью Смарти
        if (!$this->ajax_mode) {
            $this->smarty->assign('core', $this);
            $this->smarty->display($this->template);
        }
    }

    protected function setUriData()
    {
        $this->uri = mb_strtolower($_SERVER['REQUEST_URI'], "UTF-8");
        $this->uri = parse_url(preg_replace('/\/+/', "/", $this->uri, PHP_URL_PATH));
        $this->uri = preg_replace('/\/+/', "/", $this->uri['path'] . '/');
        $this->uri_chain = explode('/', trim($this->uri, '/'));
    }

    public function createAdditionalButton($name, $href)
    {
        $additional_button_data = new stdClass();

        $additional_button_data->name = $name;
        $additional_button_data->href = $href;

        $this->smarty->assign('additional_button', $additional_button_data);
        $this->module['header_additional'] = $this->smarty->fetch('common/additional_button.tpl');
    }
}