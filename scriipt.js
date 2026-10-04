// ================================
// LUMA EXPENSE TRACKER
// ================================

const modal = document.getElementById("transactionModal");
const openFormButton = document.getElementById("openForm");
const quickAddButton = document.getElementById("quickAdd");
const closeFormButton = document.getElementById("closeForm");

const transactionForm = document.getElementById("transactionForm");
const transactionList = document.getElementById("transactionList");

const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expensesElement = document.getElementById("expenses");

const typeButtons = document.querySelectorAll(".type-btn");


// ================================
// DATA
// ================================

let transactions = JSON.parse(
    localStorage.getItem("lumaTransactions")
) || [];

let transactionType = "expense";


// ================================
// MODAL
// ================================

function openModal() {
    modal.classList.add("show");
}

function closeModal() {
    modal.classList.remove("show");
}

openFormButton.onclick = openModal;
quickAddButton.onclick = openModal;
closeFormButton.onclick = closeModal;


// Close modal when clicking outside

modal.onclick = function(event) {

    if (event.target === modal) {
        closeModal();
    }

};


// ================================
// TRANSACTION TYPE
// ================================

typeButtons.forEach(function(button) {

    button.onclick = function() {

        typeButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        transactionType = button.dataset.type;
    };

});


// ================================
// SAVE DATA
// ================================

function saveTransactions() {

    localStorage.setItem(
        "lumaTransactions",
        JSON.stringify(transactions)
    );

}


// ================================
// ADD TRANSACTION
// ================================

transactionForm.onsubmit = function(event) {

    event.preventDefault();

    const title =
        document.getElementById("title").value.trim();

    const amount =
        Number(document.getElementById("amount").value);

    const category =
        document.getElementById("category").value;

    const date =
        document.getElementById("date").value;


    if (!title || !amount || !category || !date) {
        alert("Please fill in all fields.");
        return;
    }


    const newTransaction = {

        id: Date.now(),

        title: title,

        amount: amount,

        category: category,

        date: date,

        type: transactionType

    };


    transactions.unshift(newTransaction);

    saveTransactions();

    renderTransactions();

    updateSummary();

    transactionForm.reset();


    // Reset to Expense

    transactionType = "expense";

    typeButtons.forEach(function(button) {
        button.classList.remove("active");
    });

    document
        .querySelector('[data-type="expense"]')
        .classList.add("active");


    closeModal();

};


// ================================
// DELETE TRANSACTION
// ================================

function deleteTransaction(id) {

    transactions = transactions.filter(function(transaction) {

        return transaction.id !== id;

    });

    saveTransactions();

    renderTransactions();

    updateSummary();

}


// ================================
// DISPLAY TRANSACTIONS
// ================================

function renderTransactions() {

    if (transactions.length === 0) {

        transactionList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">＋</div>

                <h3>No transactions yet</h3>

                <p>
                    Add your first income or expense.
                </p>
            </div>
        `;

        return;
    }


    transactionList.innerHTML = "";


    transactions.forEach(function(transaction) {

        const item = document.createElement("div");

        item.className = "transaction-item";


        const sign =
            transaction.type === "income"
                ? "+"
                : "-";


        const formattedAmount =
            transaction.amount.toLocaleString();


        item.innerHTML = `

            <div class="transaction-left">

                <div class="transaction-icon">
                    ${transaction.category.charAt(0)}
                </div>

                <div class="transaction-details">

                    <h3>${transaction.title}</h3>

                    <div class="transaction-meta">

                        <span>${transaction.category}</span>

                        <span>•</span>

                        <span>${transaction.date}</span>

                    </div>

                </div>

            </div>


            <div class="transaction-right">

                <strong class="${transaction.type}">
                    ${sign} Rs. ${formattedAmount}
                </strong>

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})"
                    title="Delete transaction"
                >
                    ×
                </button>

            </div>

        `;


        transactionList.appendChild(item);

    });

}


// ================================
// UPDATE SUMMARY
// ================================

function updateSummary() {

    let totalIncome = 0;
    let totalExpenses = 0;


    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {

            totalIncome += transaction.amount;

        } else {

            totalExpenses += transaction.amount;

        }

    });


    const totalBalance =
        totalIncome - totalExpenses;


    balanceElement.textContent =
        `Rs. ${totalBalance.toLocaleString()}`;

    incomeElement.textContent =
        `Rs. ${totalIncome.toLocaleString()}`;

    expensesElement.textContent =
        `Rs. ${totalExpenses.toLocaleString()}`;

}


// ================================
// CURRENT DATE
// ================================

const currentDateElement =
    document.getElementById("currentDate");

const today = new Date();

currentDateElement.textContent =
    today.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });


// ================================
// START APP
// ================================

renderTransactions();

updateSummary();