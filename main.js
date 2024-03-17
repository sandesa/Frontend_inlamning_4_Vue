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
      newExpense: {
        price: "",
        date: "2024-03-20",
        desc: "",
        category: "",
      },
      userData: [],
      expenses: [],
    };
  },
  async created() {
    try {
      const response = await fetch("/data.json");
      this.expenses = await response.json();
    } catch (error) {
      console.error("Ett fel inträffad med inmatning av exempel datan:", error);
    }
    const storedExpenses = localStorage.getItem("user-data");
    if (storedExpenses) {
      this.userData = JSON.parse(storedExpenses);
      this.expenses = [...this.expenses, ...this.userData];
    }
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
        this.userData.push({
          price: Math.round(this.newExpense.price * 100) / 100,
          date: this.newExpense.date,
          desc: this.newExpense.desc,
          category: this.newExpense.category,
        });
        localStorage.setItem("user-data", JSON.stringify(this.userData));
        this.newExpense.price = "";
        this.newExpense.date = "2024-03-20";
        this.newExpense.desc = "";
        this.newExpense.category = "";
      }
    },
    removeItem(expense) {
      const index = this.expenses.findIndex((exp) => exp === expense);
      if (index !== -1) {
        this.expenses.splice(index, 1);
        const userDataIndex = this.userData.findIndex(
          (exp) =>
            exp.price === expense.price &&
            exp.date === expense.date &&
            exp.desc === expense.desc &&
            exp.category === expense.category
        );
        if (userDataIndex !== -1) {
          this.userData.splice(userDataIndex, 1);
          localStorage.setItem("user-data", JSON.stringify(this.userData));
        }
      }
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
      <div class="filtering">
        <div>
          <label for="selectMonth" class="selectLabel">Välj månad:</label>
          <select id="selectMonth" v-model="selectedMonth">
            <option value="">All</option>
            <option v-for="(month, index) in months" :key="index+1" :value="index+1">{{month}}</option>
          </select>
        </div>
        <div>
          <label for="selectCategory" class="selectLabel">Välj kategori:</label>
          <select id="selectCategory" v-model="selectedCategory">
            <option value="">None</option>
            <option value="all">All</option>
            <option v-for="(category, index) in categories" :key="index" :value="category">{{category}}</option>
          </select>
        </div>
      </div>
      
      <template v-if="filteredExpenses.length > 0">
        <table v-if="selectedCategory !== '' || selectedMonth !== ''">
          <thead>
            <tr>
              <th><a href="#" @click="sortDate">Datum</a></th>
              <th style="text-align: center"><a href="#" @click="sortPrice">Kostnad</a></th>
              <th style="text-align: center"><a href="#" @click="sortCat">Kategori</a></th>
              <th class="remove-cell"></th>
            </tr>
          </thead>
          <tbody class="expense">
            <template v-for="(exp, index) in filteredExpenses" :key="index"> 
              <tr class="info">
                <td @click="showDescription(exp)" style="width: 300px">{{exp.date}}</td>
                <td @click="showDescription(exp)" style="text-align: center">{{formatPrice(exp.price)}}</td>
                <td @click="showDescription(exp)" style="text-align: center">{{exp.category}}</td>
                <td class="remove-cell"><button @click="removeExpense(exp)" class="far fa-trash-alt custom-button"></button></td>
              </tr>
              <template v-if="selectedExpense && selectedExpense === exp">
                <tr>
                  <td><b style="color: #da7b93">Beskrivning:</b>
                    <template v-if="exp.desc.length > 0">
                      <br><i style="color: grey" id="test-desc">{{exp.desc}}</i>
                    </template>
                    <template v-else>
                      <br><i style="color: grey">Tom</i>
                    </template>
                  </td>
                </tr>
              </template>
            </template>
            <tr class="total" style="background-color: #1c3334">
              <td style="font-weight: bold;">Totalt: {{sum}}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
          <template v-if="selectedCategory !== '' || selectedMonth !== ''">
            <div class="pie-chart-container">
              <pie-chart :expenses="filteredExpenses"></pie-chart>
            </div>
          </template>
        </template>
        <template v-else>
          <p style="color: grey; padding-bottom: 15px">Inga utgifter för valda alternativ</p>
        </template>
    </div>
  `,
  computed: {
    filteredExpenses() {
      let filtered = this.allExpenses;

      if (this.selectedCategory !== "" && this.selectedCategory !== "all") {
        filtered = filtered.filter(
          (expense) => expense.category === this.selectedCategory
        );
      }

      if (this.selectedMonth !== "") {
        filtered = filtered.filter(
          (expense) =>
            new Date(expense.date).getMonth() + 1 ===
            parseInt(this.selectedMonth)
        );
      }

      return filtered;
    },
    sum() {
      let sum = 0;
      if (this.selectedCategory !== "" && this.selectedMonth !== "") {
        let filteredExpenses = this.allExpenses.filter(
          (expense) =>
            (expense.category === this.selectedCategory ||
              this.selectedCategory === "all") &&
            new Date(expense.date).getMonth() + 1 ===
              parseInt(this.selectedMonth)
        );

        filteredExpenses.forEach((exp) => {
          sum += exp.price;
        });

        return new Intl.NumberFormat("sv-SE", {
          style: "currency",
          currency: "SEK",
        }).format(sum);
      } else if (this.selectedCategory !== "") {
        let filteredExpenses = this.allExpenses.filter(
          (expense) =>
            expense.category === this.selectedCategory ||
            this.selectedCategory === "all"
        );

        filteredExpenses.forEach((exp) => {
          sum += exp.price;
        });

        return new Intl.NumberFormat("sv-SE", {
          style: "currency",
          currency: "SEK",
        }).format(sum);
      } else if (this.selectedMonth !== "") {
        let filteredExpenses = this.allExpenses.filter(
          (expense) =>
            new Date(expense.date).getMonth() + 1 ===
            parseInt(this.selectedMonth)
        );

        filteredExpenses.forEach((exp) => {
          sum += exp.price;
        });
        return new Intl.NumberFormat("sv-SE", {
          style: "currency",
          currency: "SEK",
        }).format(sum);
      }
      return new Intl.NumberFormat("sv-SE", {
        style: "currency",
        currency: "SEK",
      }).format(sum);
    },
  },
  data() {
    return {
      selectedCategory: "",
      selectedMonth: "",
      selectedExpense: null,
      showDesc: false,
      months: [
        "Jan",
        "Feb",
        "Mars",
        "April",
        "Maj",
        "Juni",
        "Juli",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    };
  },
  methods: {
    removeExpense(expense) {
      const index = this.allExpenses.indexOf(expense);
      if (index !== -1) {
        this.remove(expense);
      }
    },
    formatPrice(exp) {
      let formattedPrice = exp;

      return new Intl.NumberFormat("sv-SE", {
        style: "currency",
        currency: "SEK",
      }).format(formattedPrice);
    },
    showDescription(exp) {
      this.selectedExpense = this.selectedExpense === exp ? null : exp;
    },
  },
});

app.component("pie-chart", {
  props: ["expenses"],
  template: `
  <div id="pie-container">
    <svg width="300" height="300">
      <g :transform="'translate(' + width / 2 + ',' + height / 2 + ')'">
        <template v-for="(categoryExpense, index) in categoryExpenses">
          <path :d="generateArc(categoryExpense, index)" :fill="color(categoryExpense.category)" />
        </template>
      </g>
    </svg>
    <div class="Pie-P" v-for="(categoryExpense, index) in categoryExpenses" :key="index">
      <div class="color-square" :style="{ backgroundColor: color(categoryExpense.category) }"></div>
      {{ categoryExpense.category }}: {{ categoryExpense.percentage.toFixed(2) }}%
    </div>
  </div>
  `,
  data() {
    return {
      width: 300,
      height: 300,
      radius: Math.min(300, 300) / 2,
      colorMap: {
        Bostad: "#519DE9",
        Hushåll: "#7CC674",
        "Mat & dryck": "#73C5C5",
        Transport: "#8481DD",
        "Nöje & shopping": "#F6D173",
        Övrigt: "#2e8561",
      },
      categoryExpenses: [],
    };
  },
  watch: {
    expenses: {
      handler: function (newExpenses, oldExpenses) {
        this.calculateCategoryExpenses();
      },
      deep: true,
    },
  },
  created() {
    this.calculateCategoryExpenses();
  },
  methods: {
    calculateCategoryExpenses() {
      let categoryExpenses = [];
      let totalExpenses = 0;

      this.expenses.forEach((expense) => {
        totalExpenses += expense.price;
        let index = categoryExpenses.findIndex(
          (item) => item.category === expense.category
        );
        if (index !== -1) {
          categoryExpenses[index].price += expense.price;
        } else {
          categoryExpenses.push({
            category: expense.category,
            price: expense.price,
          });
        }
      });

      categoryExpenses.forEach((expense) => {
        expense.percentage = (expense.price / totalExpenses) * 100;
      });

      categoryExpenses.sort((a, b) => b.percentage - a.percentage);

      this.categoryExpenses = categoryExpenses;

      this.totalExpenses = totalExpenses;
    },
    generateArc(categoryExpense, index) {
      const pie = d3.pie().value((d) => d.price);
      const arc = d3.arc().innerRadius(0).outerRadius(this.radius);
      const arcs = pie(this.categoryExpenses);
      return arc(arcs[index]);
    },
    generateTextTransform(index) {
      const pie = d3.pie().value((d) => d.price);
      const arc = d3.arc().innerRadius(0).outerRadius(this.radius);
      const arcs = pie(this.categoryExpenses);
      return `translate(${arc.centroid(arcs[index])})`;
    },
    color(category) {
      return this.colorMap[category] || "black";
    },
  },
});

app.mount("#app");
