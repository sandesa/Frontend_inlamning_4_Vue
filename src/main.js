let app = Vue.createApp({
  data() {
    return {
      newExpense: {
        price: 0,
        date: "",
        desc: "",
        category: "",
      },
      expenses: [],
    };
  },
  computed: {},
  methods: {
    addExpense() {
      if (
        this.newExpense.category !== "" &&
        this.newExpense.price > 0 &&
        this.newExpense.date !== ""
      ) {
        this.expenses.push({
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
