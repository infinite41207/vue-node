<template>
  <Layout>
    <div class="title">
      <h4>Zlecenie Nr {{ object.number }} od {{ convertDate(object.date) }}</h4>
    </div>
    <div class="list-form">
      <div>
        <ul>
          <li
            >Relacja: <span class="span">{{ getObjectName('schemeOfCargo') }}</span></li
          >
          <li
            >Typ dokumentu: <span class="span">{{ object.typeOfDocument }}</span></li
          >
          <li
            >Rodzaj transakcji: <span class="span">{{ object.typeOfOperation }}</span>
          </li>
          <li
            >Właściciel: <span class="span">{{ getObjectName('owner') }}</span></li
          >
          <li
            >Towar: <span class="span">{{ getObjectName('product') }}</span></li
          >
          <li
            >Deklarowany tonaż: <span class="span">{{ object.quantity }}</span></li
          >
          <li
            >Numer, data DSK: <span class="span">{{ object.dateIssueDSK }}</span></li
          >
          <li
            >Podstawa: <span class="span">{{ getObjectNumber('base') }}</span></li
          >
          <li
            >GMP+: <span class="span">{{ convertBoolValue(object.gmp) }}</span></li
          >
          <li
            >Korespondecja: <span>{{ object.correspondence }}</span></li
          >
          <li style="margin-top: 30px"
            >Zlecenie wystawił: <span class="signiture">{{ getObjectName('author') }}</span></li
          >
        </ul>
      </div>
      <div>
        <ul>
          <li
            >Status: <span class="span">{{ object.state }}</span></li
          >
          <li
            >Stanowisko wagowe: <span class="span">{{ getObjectName('weighingStation') }}</span></li
          >
          <li
            >Waga: <span class="span">{{ getObjectName('scale') }}</span></li
          >
          <li
            >Magazyn/Plac: <span class="span">{{ getObjectName('warehouse') }}</span>
          </li>
          <li
            >Sektor magazynu: <span class="span">{{ getObjectName('warehouse') }}</span></li
          >
          <li
            >Spedytor: <span class="span">{{ getObjectName('forwarder') }}</span></li
          >
          <li
            >Status celny towaru: <span class="span">{{ object.customsStatusOfGoods }}</span></li
          >
          <li
            >Firma kontrolna: <span class="span">{{ getObjectName('controlCompany') }}</span></li
          >
          <li
            >Badania: <span class="span">{{ convertBoolValue(object.isOpenSubOrders) }}</span></li
          >
        </ul>
      </div>
    </div>
    <div class="d-print-none">
      <div class="text-right">
        <a href="javascript:window.print()" class="btn btn-primary">
          <i class="ri-printer-fill"></i>
          Drukuj
        </a>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/layouts/main'
import moment from 'moment'

export default {
  name: 'PFDOPrint',

  page: {
    title: 'Druk zlecenia',
  },

  components: {
    Layout,
  },

  data() {
    return {
      viewId: this.$route.params.id,
      object: this.$route.params.object,
    }
  },

  async created() {
    console.log('object: ', this.object)
  },

  methods: {
    getObjectName(propertyName) {
      let currentName = ''
      if (this.object) {
        if (this.object[propertyName]) {
          currentName = this.object[propertyName].name
        }
      }
      return currentName
    },

    getObjectNumber(propertyName) {
      let currentName = ''
      if (this.object) {
        if (this.object[propertyName]) {
          currentName = this.object[propertyName].number
        }
      }
      return currentName
    },

    convertDate(dateValue) {
      const convertedDate = moment(dateValue).format('DD MM YYYY')
      return convertedDate
    },

    convertBoolValue(value) {
      if (value) {
        return 'Tak'
      } else {
        return 'Nie'
      }
    },
  },
}
</script>

<style>
.title {
  display: flex;
  justify-content: center;
  color: black;
}

.list-form {
  display: flex;
  justify-content: space-around;
  color: black;
}

ul {
  list-style: none;
}

ul li {
  margin: 10px 0;
}

.signiture {
  border-bottom: 2px #000 solid;
}

.span {
  margin-left: 10px;
}
</style>