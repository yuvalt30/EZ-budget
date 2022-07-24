import { configureStore, createSlice } from "@reduxjs/toolkit";

const budget = createSlice({
  name: "chat-data",
  initialState: {
    user:
      localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")),
    showStartFrom: false,
    outcome: {
      chart: [],
      name: [],
    },
    selectedSub: {},
    income: {
      chart: [],
      name: [],
    },
    lineData: {
      name: "",
      subId: "",
    },
    summary: {
      income: {
        avg: 0,
        performance: 0,
      },
      outcome: {
        avg: 0,
        performance: 0,
      },
    },
    performanceTotal: 0,
    plannedIncome: [],
    plannedOutcome: [],
  },
  reducers: {
    outcomeChart(state, { payload }) {
      payload.chart && (state.outcome.chart = payload.chart);
      payload.name && (state.outcome.name = payload.name);
    },
    incomeChart(state, { payload }) {
      payload.chart && (state.income.chart = payload.chart);
      payload.name && (state.income.name = payload.name);
    },
    summary(state, { payload }) {
      payload.income && (state.summary.income = payload.income);
      payload.outcome && (state.summary.outcome = payload.outcome);
    },

    user(state, { payload }) {
      state.user = payload;
    },
    selectedSub(state, { payload }) {
      state.selectedSub = payload;
    },
    lineData(state, { payload }) {
      state.lineData.name = payload.name;
      state.lineData.subId = payload.subId;
    },
    showStart(state, { payload }) {
      state.showStartFrom = payload;
    },
    performanceTotal(state, { payload }) {
      state.performanceTotal = payload;
    },
    plannedIncome(state, { payload }) {
      state.plannedIncome = payload;
    },
    plannedOutcome(state, { payload }) {
      state.plannedOutcome = payload;
    },
  },
});
export const budgetActions = budget.actions;
const store = configureStore(budget);
export default store;
