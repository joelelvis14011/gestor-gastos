//LOGIN 
const LOGIN_USER = "admin";
const LOGIN_PASS = "1234";

const loginScreen = document.getElementById("login-screen");
const appScreen = document.getElementById("app-screen");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");

function checkSession() {
  if (sessionStorage.getItem("loggedIn") === "true") {
    loginScreen.style.display = "none";
    appScreen.style.display = "block";
    renderExpenses();
  }
}

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const user = document.getElementById("login-user").value.trim();
  const pass = document.getElementById("login-pass").value.trim();

  if (user === LOGIN_USER && pass === LOGIN_PASS) {
    sessionStorage.setItem("loggedIn", "true");
    loginError.textContent = "";
    loginScreen.style.display = "none";
    appScreen.style.display = "block";
    renderExpenses();
  } else {
    loginError.textContent = "Usuario o contraseña incorrectos.";
  }
});

logoutBtn.addEventListener("click", function () {
  sessionStorage.removeItem("loggedIn");
  appScreen.style.display = "none";
  loginScreen.style.display = "flex";
  loginForm.reset();
});

// ============ CRUD DE GASTOS ============
const STORAGE_KEY = "expenses";

const expenseForm = document.getElementById("expense-form");
const expenseIdInput = document.getElementById("expense-id");
const expenseDescInput = document.getElementById("expense-desc");
const expenseAmountInput = document.getElementById("expense-amount");
const expenseCategoryInput = document.getElementById("expense-category");
const expenseDateInput = document.getElementById("expense-date");
const expenseSubmitBtn = document.getElementById("expense-submit-btn");
const expenseCancelBtn = document.getElementById("expense-cancel-btn");
const expenseTableBody = document.getElementById("expense-table-body");
const expenseTotalEl = document.getElementById("expense-total");
const expenseEmptyMsg = document.getElementById("expense-empty");

function getExpenses() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveExpenses(expenses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

function renderExpenses() {
  const expenses = getExpenses();
  expenseTableBody.innerHTML = "";
  expenseEmptyMsg.style.display = expenses.length === 0 ? "block" : "none";

  let total = 0;
  expenses.forEach(function (expense) {
    total += parseFloat(expense.amount);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${expense.description}</td>
      <td>$${parseFloat(expense.amount).toFixed(2)}</td>
      <td>${expense.category}</td>
      <td>${formatDate(expense.date)}</td>
      <td class="row-actions">
        <button class="btn-edit" data-id="${expense.id}">Editar</button>
        <button class="btn-delete" data-id="${expense.id}">Eliminar</button>
      </td>
    `;
    expenseTableBody.appendChild(row);
  });

  expenseTotalEl.textContent = "$" + total.toFixed(2);

  document.querySelectorAll(".btn-edit").forEach(function (btn) {
    btn.addEventListener("click", function () { startEdit(btn.dataset.id); });
  });
  document.querySelectorAll(".btn-delete").forEach(function (btn) {
    btn.addEventListener("click", function () { deleteExpense(btn.dataset.id); });
  });
}

expenseForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (parseFloat(expenseAmountInput.value) <= 0) {
    alert("El monto debe ser mayor a 0");
    return;
  }

  const id = expenseIdInput.value;
  const expenses = getExpenses();

  const expenseData = {
    id: id || Date.now().toString(),
    description: expenseDescInput.value.trim(),
    amount: expenseAmountInput.value,
    category: expenseCategoryInput.value,
    date: expenseDateInput.value,
  };

  if (id) {
    const index = expenses.findIndex(function (exp) { return exp.id === id; });
    if (index !== -1) expenses[index] = expenseData;
  } else {
    expenses.push(expenseData);
  }

  saveExpenses(expenses);
  resetForm();
  renderExpenses();
});

function startEdit(id) {
  const expenses = getExpenses();
  const expense = expenses.find(function (exp) { return exp.id === id; });
  if (!expense) return;

  expenseIdInput.value = expense.id;
  expenseDescInput.value = expense.description;
  expenseAmountInput.value = expense.amount;
  expenseCategoryInput.value = expense.category;
  expenseDateInput.value = expense.date;

  expenseSubmitBtn.textContent = "Guardar cambios";
  expenseCancelBtn.style.display = "inline-block";
}

function deleteExpense(id) {
  if (!confirm("¿Eliminar este gasto?")) return;
  const expenses = getExpenses().filter(function (exp) { return exp.id !== id; });
  saveExpenses(expenses);
  renderExpenses();
}

expenseCancelBtn.addEventListener("click", resetForm);

function resetForm() {
  expenseForm.reset();
  expenseIdInput.value = "";
  expenseSubmitBtn.textContent = "Agregar";
  expenseCancelBtn.style.display = "none";
}

checkSession();