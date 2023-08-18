<style>
.main-text {
  margin-top: -10px;
}
.barcode {
  position: absolute;
  margin-left: 130px;
  display: flex;
}
.line {
  display: flex;
  justify-content: space-between;
}
</style>

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'

/**
 * Invoice component
 */
export default {
  name: 'ReclPFMileageProtocol',

  page: {
    title: 'Invoice',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: '',
    }
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" />
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <!-- Invoice Logo-->
            <div class="clearfix">
              <div class="float-left mb-3">
                <img src="@/assets/images/logo/logo.png" alt height="18" />
              </div>
            </div>

            <!-- Invoice Detail-->
            <div class="row">
              <div class="col-sm-6">
                <div class="float-left mt-3">
                  <p>
                    <b>Przedsiębiorstwo produkcyjne OknoPlus Sp. z o.o.</b> <br />
                    <b>ZGŁOSZNIE GWARANCYJNE</b> <br />
                    <b>PROTOKÓŁ REJESTRACJI</b> <br />
                  </p>
                </div>
              </div>
              <!-- end col -->
              <div class="col-sm-4 offset-sm-2">
                <div class="mt-3 float-sm-right">
                  <p class="font-13"> <strong>Order Date:</strong> &nbsp;&nbsp;&nbsp; Jan 17, 2018 </p>
                </div>
              </div>
              <!-- end col -->
            </div>
            <!-- end row -->

            <div class="row mt-4">
              <div class="col-sm-4 line">
                <h6>ZGŁOSZENIE</h6>
              </div>

              <div class="col-sm-4 line">
                <h6>01126/2021</h6>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-4 line main-text">
                <h6>PUNKT SPRZEDAŻY</h6>
              </div>

              <div class="col-sm-4 line main-text">
                <h6>KAMIL GRALA house studio ul. Zakopiańska 56 30-418 Kraków</h6>
              </div>
              <div class="col-sm-4">
                <div class="text-sm-right">
                  <img src="@/assets/images/barcode.png" alt="barcode-image" class="img-fluid mr-2 barcode" />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-4 line main-text">
                <h6>UMOWA</h6>
              </div>

              <div class="col-sm-4 line main-text">
                <h6>A2101KG00021</h6>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-4 line main-text">
                <h6>SPRZEDAŻ</h6>
              </div>

              <div class="col-sm-4 line main-text">
                <h6>25.05.2021</h6>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-4 line main-text">
                <h6>KARTA GWARANCYJNA</h6>
              </div>

              <div class="col-sm-4 line main-text">
                <h6>TAK</h6>
              </div>
            </div>

            <!-- NEXT LINE -->

            <div class="row mt-4">
              <div class="col-sm-4 line main-text">
                <h6>IMIĘ</h6>
              </div>

              <div class="col-sm-4 line main-text">
                <h6>Viktoryn</h6>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-4 line main-text">
                <h6>NAZWISKO</h6>
              </div>

              <div class="col-sm-4 line main-text">
                <h6>Drahoslav</h6>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-4 line main-text">
                <h6>ADRES</h6>
              </div>

              <div class="col-sm-4 line main-text">
                <h6>30-418 kraków Focha 32/8</h6>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-4 line main-text">
                <h6>MONTAŻ</h6>
              </div>

              <div class="col-sm-4 line main-text">
                <h6>32-080 Zabierzów ul. Brzozowa 8</h6>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-4 line main-text">
                <h6>TELEFON</h6>
              </div>

              <div class="col-sm-4 line main-text">
                <h6>537 336 893</h6>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-4 line main-text">
                <h6>MAIL</h6>
              </div>

              <div class="col-sm-4 line main-text">
                <h6>biuro@house-studio.pl</h6>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-sm-4 line main-text">
                <h6>DECYZJA</h6>
              </div>

              <div class="col-sm-4 line main-text">
                <h6>-</h6>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-4 line main-text">
                <h6>DATA DECYZJI</h6>
              </div>

              <div class="col-sm-4 line main-text">
                <h6></h6>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-4 line main-text">
                <h6>OCZEKIWANIA</h6>
              </div>

              <div class="col-sm-4 line main-text">
                <h6></h6>
              </div>
            </div>
            <!-- end row -->

            <div class="row">
              <div class="col-12">
                <div class="table-responsive">
                  <table class="table mt-4">
                    <thead>
                      <tr>
                        <th>Pozycja WH</th>
                        <th>Ilość okien/drzwi</th>
                        <th>Kwatera</th>
                        <th>Przedmiot</th>
                        <th class="text-right">Opis</th>
                        <th>Decyzja</th>
                        <th>Realizacja</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>Nieszczelność</td>
                        <td class="text-right"
                          >Skrzydło wygina się w banan tworząc 1cm przerwę środkiem, powoduje to brak doszczelnienia górą i dołem, klientowi wlewa się woda.</td
                        >
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- end table-responsive-->
              </div>
              <!-- end col -->
            </div>
            <!-- end row -->

            <div class="row">
              <div class="clearfix pt-3">
                <h6>UZASADNIENIE</h6>
                <h6>KOMENTARZ WEWNĘTRZNY</h6>
              </div>
            </div>
            <div>
              <h3>Pliki</h3>
              <table class="table mt-4">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Nazwa</th>
                    <th>Opis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>02.11.2021</td>
                    <td>IMG_0202.MOV</td>
                    <td> Skrzydło wygina się w banan tworząc 1cm przerwę środkiem, powoduje to brak doszczelnienia górą i dołem, klientowi wlewa się woda. </td>
                  </tr>
                  <tr>
                    <td>02.11.2021</td>
                    <td>IMG_0203_(3).jpg</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3>Historia</h3>
              <table class="table mt-4">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Użytkownik</th>
                    <th>Akcja</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>02.11.2021</td>
                    <td>HOUSE STUDIO</td>
                    <td>Dodanie zgłoszenia</td>
                  </tr>
                  <tr>
                    <td>02.11.2021</td>
                    <td>HOUSE STUDIO</td>
                    <td>Dodanie pliku</td>
                  </tr>
                  <tr>
                    <td>02.11.2021</td>
                    <td>HOUSE STUDIO</td>
                    <td>Dodanie pliku</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3>Wiadomości</h3>
              <table class="table mt-4">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Od</th>
                    <th>Do</th>
                    <th>Tytuł</th>
                    <th>Akcja</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>02.11.2021</td>
                    <td>grala@oknoplus.com.pl</td>
                    <td>reklamacje@oknoplus.com.pl</td>
                    <td> ZGŁOSZENIE 01126/2021 UMOWA A2101KG00021 GRALA HOUSE STUDIO Informacja o dodaniu załącznika</td>
                    <td>Plik</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colspan="6">
                      Dzień dobry, Do zgłoszenia 01126/2021 o statusie Nowe zlecenie dotyczącego umowy A2101KG00021 został dołączony załącznik. Koniecznie sprawdź jego zawartość.
                      Wiadomość wygenerowana automatycznie. http://147.135.210.58/ords/f?p=121:LOGIN_DESKTOP:1578892325718::::: Dział Reklamacji PP OknoPlus
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3>Zlecenia produkcyjne</h3>
              <table class="table mt-4">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Numer zlecenia</th>
                    <th>Opis</th>
                    <th>Przewidywana data realizacji</th>
                  </tr>
                </thead>
                <tbody> </tbody>
              </table>
            </div>
            <!-- end row-->

            <div class="d-print-none mt-4">
              <div class="text-right">
                <a href="javascript:window.print()" class="btn btn-primary"> <i class="ri-printer-fill"></i> Drukuj </a>
                <!-- <a href="javascript: void(0);" class="btn btn-info ml-1">Submit</a> -->
              </div>
            </div>
            <!-- end buttons -->
          </div>
          <!-- end card-body-->
        </div>
        <!-- end card -->
      </div>
      <!-- end col-->
    </div>
    <!-- end row -->
  </Layout>
</template>
