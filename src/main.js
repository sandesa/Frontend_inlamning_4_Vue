let app = Vue.createApp({
  data() {
    return {
      descPrice: false,
      descDate: false,
      descCat: false,
      categories: [
        "Bostad",
        "Hushåll",
        "Mat & dryck",
        "Transport",
        "Nöje & shopping",
        "Övrigt",
      ],
      months: {},
      newExpense: {
        price: 0,
        date: "",
        desc: "",
        category: "",
      },
      expenses: [
        {
          price: 100.32,
          date: "2024-04-10",
          desc: "",
          category: "Bostad",
        },
        {
          price: 1001.01,
          date: "2024-03-11",
          desc: "",
          category: "Bostad",
        },
        {
          price: 10011.1,
          date: "2024-02-11",
          desc: "",
          category: "Hushåll",
        },
        {
          price: 1100.2,
          date: "2024-03-11",
          desc: "",
          category: "Övrigt",
        },
        {
          price: 100.02,
          date: "2024-03-10",
          desc: "",
          category: "Transport",
        },
        {
          price: 10.04,
          date: "2024-03-11",
          desc: "",
          category: "Nöje & shopping",
        },
        {
          price: 100.35,
          date: "2024-01-11",
          desc: "Random desc",
          category: "Bostad",
        },
        {
          price: 220.98,
          date: "2024-01-11",
          desc: "Random desc",
          category: "Transport",
        },
      ],
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
          price: Math.round(this.newExpense.price * 100) / 100,
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
    removeItem(index) {
      this.expenses.splice(index, 1);
    },
    sortOnCategory() {
      this.descCat = !this.descCat;
      this.expenses = this.expenses.sort((a, b) => {
        let expA = a.category.toLowerCase(),
          expB = b.category.toLowerCase();
        if (expA < expB) {
          return this.descCat ? -1 : 1;
        } else if (expA > expB) {
          return this.descCat ? 1 : -1;
        }
        return 0;
      });
    },
    sortOnPrice() {
      this.descPrice = !this.descPrice;
      this.expenses = this.expenses.sort((a, b) => {
        let expA = a.price,
          expB = b.price;
        if (expA > expB) {
          return this.descPrice ? -1 : 1;
        } else if (expA < expB) {
          return this.descPrice ? 1 : -1;
        }
        return 0;
      });
    },
    sortOnDate() {
      this.descDate = !this.descDate;
      this.expenses = this.expenses.sort((a, b) => {
        let dateA = new Date(a.date);
        let dateB = new Date(b.date);
        return this.descDate ? dateB - dateA : dateA - dateB;
      });
    },
  },
});

app.component("result-table", {
  props: [
    "categories",
    "allExpenses",
    "remove",
    "sortCat",
    "sortPrice",
    "sortDate",
  ],
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
            <th><a href="#" @click="sortPrice">Kostnad</a></th>
            <th><a href="#" @click="sortDate">Datum</a></th>
            <th><a href="#" @click="sortCat">Category</a></th>
            <th>Beskrivning</th>
          </tr>
          <template v-for="(exp, index) in allExpenses"
          :key="index"> 
          <tr v-if="exp.category === selectedCategory || selectedCategory === 'all'">
            <td>{{exp.price}}</td>
            <td>{{exp.date}}</td>
            <td>{{exp.category}}</td>
            <td>{{exp.desc}}</td>
            <button @click="remove(index)" class="far fa-trash-alt"></button>
          </tr>
          </template>
          <tr>
            <td>Summa:</td>
            <td>{{sum}}</td>
          </tr>
        </table>
      </div>
    `,
  computed: {
    sum() {
      let sum = 0;
      if (this.selectedCategory !== "") {
        this.allExpenses.forEach((exp) => {
          if (
            exp.category === this.selectedCategory ||
            this.selectedCategory === "all"
          ) {
            sum += exp.price;
          }
          sum = Math.round(sum * 100) / 100;
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
  methods: {},
});

app.mount("#app");
