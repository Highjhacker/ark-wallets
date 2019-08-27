<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Arkwallets') }}</title>

    <meta name="description" itemprop="description" content="Arkwallets allows to easily monitor your wallets for ARK and bridgechains." />
    <meta name="keywords" content="crypto,ark,bridgechains,wallets,blockchain" />

    <link rel="shortcut icon" type="image/png" href="{{ asset('favicon.ico') }}"/>
    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('apple-touch-icon.png') }}">
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('favicon-32x32.png') }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('favicon-16x16.png') }}favicon-16x16.png">
    <link rel="manifest" href="{{ asset('site.webmanifest') }}">

    <meta property="og:image" content="{{ asset('images/cover.png') }}" />
    <meta property="og:image:secure_url" content="{{ asset('images/cover.png') }}" />
    <meta property="og:description" content="Arkwallets allows to easily monitor your wallets for ARK and bridgechains." />
    <meta property="og:title" content="Arkwallets" />
    <meta property="og:url" content="https://arkwallets.com" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="{{ app()->getLocale() }}" />
    <meta property="og:site_name" content="Arkwallets" />

    <meta property="twitter:card" content="{{ asset('images/cover.png') }}">
    <meta property="twitter:content" content="https://arkwallets.com">
    <meta property="twitter:title" content="Arkwallets">
    <meta property="twitter:description" content="Arkwallets allows to easily monitor your wallets for ARK and bridgechains.">
    <meta property="twitter:image" content="{{ asset('images/cover.png') }}">

    <!-- Styles -->
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css">
    <script src="https://kit.fontawesome.com/b32dbc90f4.js"></script>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-119780488-5"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-119780488-5');
    </script>

</head>
<body class="bg-gray-100 h-screen antialiased leading-none">
<div id="app">
    <nav class="bg-blue-900 shadow mb-8 py-6">
        <div class="container mx-auto px-6 md:px-0">
            <navbar-component></navbar-component>
        </div>
    </nav>
    <modal-component :showing="exampleModalShowing" @close="exampleModalShowing = false"></modal-component>
    @yield('content')
</div>

<footer class='w-full text-center border-t border-grey p-4 pin-b'>
    This is our footer
</footer>
<!-- Scripts -->
<script src="{{ mix('js/app.js') }}"></script>
</body>
</html>