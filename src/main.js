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
      totalExpenses: {
        all: [],
        bostad: [],
        hushåll: [],
        matOchDryck: [],
        transport: [],
        nöjeOchShopping: [],
        övrigt: [],
      },
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
        let temp = this.newExpense.category;
        if (temp === this.categories[2]) {
          temp = "matOchDryck";
        } else if (temp === this.categories[4]) {
          temp = "nöjeOchShopping";
        }
        temp = temp[0].toLowerCase() + temp.slice(1);
        this.totalExpenses[temp].push({
          price: this.newExpense.price,
          date: this.newExpense.date,
          desc: this.newExpense.desc,
          category: this.newExpense.category,
        });
        this.totalExpenses.all.push({
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

app.component("result-table", {
  props: ["categories", "totalExp", "selectedCategory"],
  template: `
    <div>
      <label for="selectCategory">Select a category:</label>
      <select id="selectCategory" v-model="selectedCategory">
        <option value="">None</option>
        <option value="all">All</option>
        <option
          v-for="(category, index) in categories"
          :key="index"
          :value="category"
        >
          {{category}}
        </option>
      </select>

      <table v-if="selectedCategory !== ''">
        <tr>
          <th>Kostnad</th>
          <th>Datum</th>
          <th>Kategori</th>
          <th>Beskrivning</th>
        </tr>
        <tr
          v-for="(exp, index) in totalExp[formattedCategory]"
          :key="index"
        >
          <td>{{exp.price}}</td>
          <td>{{exp.date}}</td>
          <td>{{exp.category}}</td>
          <td>{{exp.desc}}</td>
        </tr>
        <tr>
          <td>Summa:</td>
          <td>{{sum}}</td>
        </tr>
      </table>
    </div>
  `,
  computed: {
    formattedCategory() {
      let temp = this.selectedCategory;
      if (temp === this.categories[2]) {
        temp = "matOchDryck";
      } else if (temp === this.categories[4]) {
        temp = "nöjeOchShopping";
      }
      return temp[0].toLowerCase() + temp.slice(1);
    },
    sum() {
      let sum = 0;
      if (this.formattedCategory !== "") {
        this.totalExp[this.formattedCategory].forEach((exp) => {
          sum += exp.price;
        });
        return sum;
      }
    },
  },
  data() {
    return {
      selectedCategory: "",
    };
  },
});

app.mount("#app");
