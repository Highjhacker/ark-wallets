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

<body class="text-gray-700 bg-white" style="font-family: 'Source Sans Pro', sans-serif">
<div id="app">
    <nav>
        <navbar-component></navbar-component>
    </nav>

    <modal-component :showing="exampleModalShowing" @close="exampleModalShowing = false"></modal-component>

    <div class="py-20" style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%)">
        <div class="container mx-auto px-6">
            <h2 class="text-4xl font-bold mb-2 text-white">
                Monitor your wallets with ease !
            </h2>
            <h3 class="text-2xl mb-8 text-gray-200">
                Monitor your Ark and bridgechains wallets at a glance !
            </h3>
            <wallet-form-component></wallet-form-component>
        </div>
    </div>

    <!-- Testimonials -->
    <section class="bg-gray-100">
        <div class="container mx-auto px-6 py-20">
            <h2 class="text-4xl font-bold text-center text-gray-800 mb-8">
                Wallets
            </h2>
            <wallets-gallery-component></wallets-gallery-component>
        </div>
    </section>

    <!--Footer-->
    <footer class="bg-grey-200">
        <div class="container mx-auto px-6 pt-10 pb-6">
            <div class="flex flex-wrap">
                <div class="w-full md:w-1/4 text-center md:text-left ">
                    <h5 class="uppercase mb-6 font-bold">ARK</h5>
                    <ul class="mb-4">
                        <li class="mt-2">
                            <a href="https://ark.io" class="hover:underline text-gray-600 hover:text-orange-500">Website</a>
                        </li>
                        <li class="mt-2">
                            <a href="https://github.com/ArkEcosystem" class="hover:underline text-gray-600 hover:text-orange-500">Github</a>
                        </li>
                        <li class="mt-2">
                            <a href="https://explorer.ark.io" class="hover:underline text-gray-600 hover:text-orange-500">Explorer</a>
                        </li>
                    </ul>
                </div>
                <div class="w-full md:w-1/4 text-center md:text-left ">
                    <h5 class="uppercase mb-6 font-bold">ACF</h5>
                    <ul class="mb-4">
                        <li class="mt-2">
                            <a href="https://arkcommunity.fund" class="hover:underline text-gray-600 hover:text-orange-500">Website</a>
                        </li>
                    </ul>
                </div>
                <div class="w-full md:w-1/4 text-center md:text-left ">
                    <h5 class="uppercase mb-6 font-bold">Contact</h5>
                    <ul class="mb-4">
                        <li class="mt-2">
                            <a href="https://slack.ark.io" class="hover:underline text-gray-600 hover:text-orange-500">Slack</a>
                        </li>
                        <li class="mt-2">
                            <a href="https://github.com/Highjhacker" class="hover:underline text-gray-600 hover:text-orange-500">Github</a>
                        </li>
                    </ul>
                </div>
                <div class="w-full md:w-1/4 text-center md:text-left ">
                    <h5 class="uppercase mb-6">Funded with <i class="fas fa-heart"></i> by <a href="https://arkcommunity.fund">ACF</a></h5>
                </div>
            </div>
        </div>
    </footer>
</div>
<script src="{{ mix('js/app.js') }}"></script>
</body>
</html>