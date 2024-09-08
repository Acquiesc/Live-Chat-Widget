@extends('layouts.app')
@section('content')

<div class="container-fluid bg-secondary">
    <div class="row">
        <div class="col text-center">
            <h1 class="fw-bold display-1 text-white">Live Chat Widget</h1>
        </div>
    </div>
</div>

@include('inc.live_widget.live_widget')

@endsection