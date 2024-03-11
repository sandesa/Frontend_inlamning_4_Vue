let app = Vue.createApp({
  data() {
    return {
      categories: [
        "Bostad",
        "Hushåll",
        "Mat & dryck",
        "Transport",
        "Nöje & shopping",
        "Övrigt",
      ],
      newExpense: {
        price: 0,
        date: "",
        desc: "",
        category: "",
      },
      totalExpenses: [],
    };
  },
  computed: {
    totalPrice: function () {
      let sum = 0;
      this.totalExpenses.forEach((exp) => {
        sum += exp.price;
      });
      return sum;
    },
  },
  methods: {
    addExpense() {
      if (
        this.newExpense.category !== "" &&
        this.newExpense.price > 0 &&
        this.newExpense.date !== ""
      ) {
        this.totalExpenses.push({
          price: this.newExpense.price,
          date: this.newExpense.date,
          desc: this.newExpense.desc,
          category: this.newExpense.category,
        });
        this.newExpense.price = 0;
        this.newExpense.date = "";
        this.newExpense.desc = "";
        this.newExpense.category = "";
      } else {
        alert("Ej korrekt input");
      }
    },
  },
});

app.mount("#app");
