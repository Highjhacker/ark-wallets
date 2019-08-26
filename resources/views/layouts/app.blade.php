<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Styles -->
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css">
    <script src="https://kit.fontawesome.com/b32dbc90f4.js"></script>
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

<!-- Scripts -->
<script src="{{ mix('js/app.js') }}"></script>
</body>
</html>