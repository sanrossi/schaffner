const FormAutoFill = new Vue({
  el: '#app',
  data: {

    // Google Apps Script 部署為網路應用程式後的 URL
    gas: 'https://script.google.com/macros/s/AKfycbwr_0fM0B5p_pi9wr7ST9G5_04DlE5YOGeOAx6IOqI-7NM8eShkyT9ZT7zFGqoJrTV4/exec',

    phone: '',

    // 避免重複 POST，存資料用的
    persons: {},

    // 頁面上吐資料的 data
    person: {},

    // Google Form 的 action URL
    formAction: 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSe8RwmqCwX7e8K61i4bnmd1X01XQ5Dbygj40eEsflk3HoEcfg/formResponse',

    // Google Form 各個 input 的 name
    input: {
      phone: 'entry.1345166848',
      name: 'entry.394656167',
      company: 'entry.664737046',
      taxID: 'entry.1826921604',

    },

    // loading 效果要不要顯示
    loading: false
  },
  methods: {
    // ID 限填 10 碼
    limitIdLen(val) {
      if(val.length > 10) {
        return this.phone =  this.phone.slice(0, 10);
      }
    },
    // 送出表單
    submit() {
      // 再一次判斷是不是可以送出資料
      if(this.person.name !== undefined) {
        let params = `${this.input.phone}=${this.person.phone}&${this.input.name}=${this.person.name}&${this.input.company}=${this.person.company}&${this.input.taxID}=${this.person.taxID}`;
        fetch(this.formAction + '?' + params, {
          method: 'POST'
        }).catch(err => {
            alert('提交成功。');
            this.phone = '';
            this.person = {};
          })
      }
    }
  },
  watch: {
    phone: function(val) {
      // phone 輸入到 10 碼就查詢資料
      if(val.length === 10) {

        // this.persons 裡沒這筆資料，才 POST
        if(this.persons[this.phone] === undefined) {
          this.loading = true;
          let uri = this.gas + '?phone=' + this.phone;
          fetch(uri, {
            method: 'POST'
          }).then(res => res.json())
            .then(res => {
              this.persons[this.phone] = res; // 把這次查詢的 phone 結果存下來
              this.person = res;
              this.loading = false;
            })
        }
        // this.persons 裡有資料就吐資料
        else {
          this.person = this.persons[this.phone];
        }

      }
    }
  }
})
