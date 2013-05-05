<title>{$core->module.title}</title>

<meta charset="utf-8">

<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/ico" href="/favicon.ico" />

<link rel="stylesheet" type="text/css" href="/control/resources/css/kube.css" />
<link rel="stylesheet" type="text/css" href="/control/resources/css/master.css" />

<link rel="stylesheet" type="text/css" href="/control/resources/plugins/meow/jquery.meow.css" />
<link rel="stylesheet" type="text/css" href="/control/resources/plugins/jquery-core-ui-select/css/jquery.scrollpane.css" />
<link rel="stylesheet" type="text/css" href="/control/resources/plugins/jquery-core-ui-select/css/core-ui-select.css" />
<link rel="stylesheet" type="text/css" href="/control/resources/plugins/slickswitch/css/slickswitch.css" />

{if $core->auth->user.status}
<script src="/control/meta"></script>
{/if}

<script src="/control/resources/js/jquery-2.0.0.min.js"></script>
<script src="/control/resources/js/jquery.cookie.js"></script>
<script src="/control/resources/js/jquery.mousewheel.js"></script>
<script src="/control/resources/js/jquery.scrollpane.js"></script>

{*<script src="/control/resources/plugins/flot/jquery.flot.min.js"></script>
<script src="/control/resources/plugins/flot/jquery.flot.resize.min.js"></script>*}
<script src="/control/resources/plugins/jquery-ui/jquery-ui-1.10.2.custom.min.js"></script>
<script src="/control/resources/plugins/meow/jquery.meow.js"></script>
<script src="/control/resources/plugins/jquery-core-ui-select/js/jquery.core-ui-select.js"></script>
<script src="/control/resources/plugins/slickswitch/js/jquery.slickswitch.js" type="text/javascript"></script>

<script src="/control/resources/js/core.js"></script>
<script src="{$core->module.dir}/js/{$core->module.name}.js"></script>

<!--[if lt IE 9]>
<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->