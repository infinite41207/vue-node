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
            <div>
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
              <div class="row mt-4">
                <div class="col-sm-4">
                  <h6>ZGŁOSZENIE</h6>
                  <h6>PUNKT SPRZEDAŻY</h6>
                  <h6>UMOWA</h6>
                </div>
                <div class="col-sm-4">
                  <h6>01126/2021</h6>
                  <h6>KAMIL GRALA house studio ul. Zakopiańska 56 30-418 Kraków</h6>
                  <h6>A2101KG00021</h6>
                </div>
              </div>
              <div>
                <h3>Zamówenia</h3>
                <table class="table mt-4">
                  <thead>
                    <tr>
                      <th>Numer</th>
                      <th>Elementy</th>
                      <th>Data realizacji</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="long"></td>
                      <td class="long"></td>
                      <td class="long"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h3>Zlecenia serwisowe</h3>
                <table class="table mt-4">
                  <thead>
                    <tr>
                      <th>Numer</th>
                      <th>Opis</th>
                      <th>Data realizacji</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="long"></td>
                      <td class="long"></td>
                      <td class="long"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h3>Reklamacje do dostawcy</h3>
                <table class="table mt-4">
                  <thead>
                    <tr>
                      <th>Numer</th>
                      <th>Dostawca</th>
                      <th>Opis</th>
                      <th>Data realizacji</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="long"></td>
                      <td class="long"></td>
                      <td class="long"></td>
                      <td class="long"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h3>Uwagi</h3>
                <table class="table mt-4">
                  <tbody>
                    <tr>
                      <td class="long"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <table class="table mt-4">
                  <tbody>
                    <tr>
                      <td class="long">Elementy gotowe do odbioru</td>
                      <td class="long">Koszt</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="row">
              <div>
                <div class="clearfix pt-3">
                  <p>
                    <small> Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb rozpatrzenia i realizacji zgłoszenia. </small>
                  </p>
                  <p>
                    <small> W przypadku nieuzasadnionego zgłoszenia, klient zobowiązany jest do pokrycia kosztów dojazdu serwisu. </small>
                  </p>
                  <p>
                    <small>
                      W przypadku realizacji zgłoszenia przez serwis fabryczny PP OknoPlus klient zobowiązany jest do przedłożenia serwisantowi karty gwarancyjnej dołączonej do
                      zakupionych okien lub drzwi.
                    </small>
                  </p>
                </div>
              </div>
              <!-- end col -->
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

<script>
import appConfig from '@/app.config'
import Layout from '@/layouts/main'
import PageHeader from '@/components/page-header'

export default {
  name: 'ReclPFServiceProtocol',

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

<style>
.long {
  height: 150px;
}

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
