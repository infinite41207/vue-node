<template>
  <body class="authentication-bg">
    <div class="account-pages mt-5 mb-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5">
            <div class="card">
              <!-- Logo -->
              <div class="card-header pt-4 pb-4 text-center bg-primary">
                <router-link tag="a" to="/">
                  <span>
                    <img :src="logoUrl" alt height="18" />
                  </span>
                </router-link>
              </div>

              <div class="card-body p-4">
                <div class="text-center">
                  <h1 class="text-error"> 4<i class="ri-emotion-unhappy-fill"></i>4 </h1>
                  <h4 class="text-uppercase text-danger mt-3">Page Not Found</h4>
                  <p class="text-muted mt-3">
                    It's looking like you may have taken a wrong turn. Don't worry... it happens to the best of us. Here's a little tip that might help you get back on track.
                  </p>

                  <router-link tag="a" class="btn btn-info mt-3" to="/"> <i class="ri-reply-fill"></i> Return Home </router-link>
                </div>
              </div>
              <!-- end card-body-->
            </div>
            <!-- end card -->
          </div>
          <!-- end col -->
        </div>
        <!-- end row -->
      </div>
      <!-- end container -->
    </div>
    <!-- end page -->

    <footer class="footer footer-alt">2020 - 2023 © Praktyk - SYNERGY</footer>
  </body>
</template>

<script>
export default {
  name: 'Error404Page',
  data() {
    return {
      logoUrl: require('@/assets/images/logo/logo-green.png'),
    }
  },
}
</script>
