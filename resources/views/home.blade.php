@extends('layouts.app')

@section('content')
    <div class="flex items-center">
            @if (session('status'))
                <div class="text-sm border border-t-8 rounded text-green-700 border-green-600 bg-green-100 px-3 py-4 mb-4" role="alert">
                    {{ session('status') }}
                </div>
            @endif

            <div class="container my-12 mx-auto px-4 md:px-12">
                <div class="font-semibold bg-gray-200 text-gray-700 py-3 px-6 mb-0">
                    Add your Wallet
                </div>

                <div class="w-full p-6">
                    <wallet-form-component></wallet-form-component>
                </div>

                <wallets-gallery-component></wallets-gallery-component>
            </div>
    </div>
@endsection