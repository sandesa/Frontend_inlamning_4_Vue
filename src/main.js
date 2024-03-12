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
      months: {},
      newExpense: {
        price: 0,
        date: "",
        desc: "",
        category: "",
      },
      expenses: [
        {
          price: 100,
          date: "2024-04-10",
          desc: "",
          category: "Bostad",
        },
        {
          price: 1001,
          date: "2024-03-11",
          desc: "",
          category: "Bostad",
        },
        {
          price: 10011,
          date: "2024-02-11",
          desc: "",
          category: "Hushåll",
        },
        {
          price: 1100,
          date: "2024-03-11",
          desc: "",
          category: "Övrigt",
        },
        {
          price: 100,
          date: "2024-03-10",
          desc: "",
          category: "Transport",
        },
        {
          price: 10,
          date: "2024-03-11",
          desc: "",
          category: "Nöje & shopping",
        },
        {
          price: 100,
          date: "2024-01-11",
          desc: "Random desc",
          category: "Bostad",
        },
        {
          price: 220,
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
    removeItem(index) {
      this.expenses.splice(index, 1);
    },
  },
});

app.component("result-table", {
  props: ["categories", "allExpenses", "selectedCategory", "remove"],
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
