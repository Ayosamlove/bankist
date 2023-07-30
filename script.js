'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
	owner: 'Jonas Schmedtmann',
	movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
	interestRate: 1.2, // %
	pin: 1111,
};

const account2 = {
	owner: 'Jessica Davis',
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,
};

const account3 = {
	owner: 'Steven Thomas Williams',
	movements: [200, -200, 340, -300, -20, 50, 400, -460],
	interestRate: 0.7,
	pin: 3333,
};

const account4 = {
	owner: 'Sarah Smith',
	movements: [430, 1000, 700, 50, 90],
	interestRate: 1,
	pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
	containerMovements.innerHTML = '';

	const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

	movs.forEach(function (mov, i) {
		const type = mov > 0 ? 'deposit' : 'withdrawal';
		const html = `
		<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
			i + 1
		} ${type}</div>
          <div class="movements__value">${mov}£</div>
        </div> 
		`;
		containerMovements.insertAdjacentHTML('afterbegin', html);
	});
};

const calcDisplaySummary = function (acc) {
	const income = acc.movements
		.filter((mov) => mov > 0)
		.reduce((acc, mov) => acc + mov, 0);
	labelSumIn.textContent = `£${income}`;

	const outcome = acc.movements
		.filter((mov) => mov < 0)
		.reduce((acc, mov) => acc + mov, 0);
	labelSumOut.textContent = `£${Math.abs(outcome)}`;

	const interest = acc.movements
		.filter((mov) => mov > 0)
		.map((deposit) => (deposit * acc.interestRate) / 100)
		.filter((mov) => mov >= 1)
		.reduce((acc, int) => acc + int, 0);
	labelSumInterest.textContent = `£${interest}`;
};

const calcDisplayBalance = function (acc) {
	acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

	labelBalance.textContent = `£${acc.balance}`;
};

const createUsernames = function (accs) {
	accs.forEach(function (acc) {
		acc.username = acc.owner
			.toLowerCase()
			.split(' ')
			.map((name) => name[0])
			.join('');
	});
};
createUsernames(accounts);

const updateUI = function (acc) {
	//Display movements
	displayMovements(acc.movements);

	//Display Balance
	calcDisplayBalance(acc);

	//Display Summary
	calcDisplaySummary(acc);
};

//Event listeners
let currentAccount;

btnLogin.addEventListener('click', function (e) {
	e.preventDefault();

	currentAccount = accounts.find(
		(acc) => acc.username === inputLoginUsername.value
	);
	if (currentAccount?.pin === Number(inputLoginPin.value)) {
		//Display UI and welcome message
		labelWelcome.textContent = `Welcome back, ${
			currentAccount.owner.split(' ')[0]
		}`;
		containerApp.style.opacity = 100;

		//clear input fields
		inputLoginPin.value = inputLoginUsername.value = '';
		inputLoginPin.blur();

		//Update UI
		updateUI(currentAccount);
	}
});

btnTransfer.addEventListener('click', function (e) {
	e.preventDefault();
	const amount = Number(inputTransferAmount.value);
	const receiverAcc = accounts.find(
		(acc) => acc.username === inputTransferTo.value
	);

	inputTransferAmount.value = inputTransferTo.value = '';

	if (
		amount > 0 &&
		receiverAcc &&
		(currentAccount.balance >= amount) &
			(receiverAcc?.username !== currentAccount.username)
	) {
		//Doing the transfer
		currentAccount.movements.push(-amount);
		receiverAcc.movements.push(amount);

		//update UI
		updateUI(currentAccount);
	}
});

btnLoan.addEventListener('click', function (e) {
	e.preventDefault();

	const amount = Number(inputLoanAmount.value);
	if (
		amount > 0 &&
		currentAccount.movements.some((mov) => mov >= amount * 0.1)
	) {
		//Add movement
		currentAccount.movements.push(amount);

		//Update UI
		updateUI(currentAccount);

		//Clear inpuut field
		inputLoanAmount.value = '';
	}
});

btnClose.addEventListener('click', function (e) {
	e.preventDefault();

	if (
		inputCloseUsername.value === currentAccount.username &&
		Number(inputClosePin.value) === currentAccount.pin
	) {
		const index = accounts.findIndex(
			(account) => account.username === currentAccount.username
		);

		//Delete the account
		accounts.splice(index, 1);

		//Hide UI
		containerApp.style.opacity = 0;

		labelWelcome.textContent = 'Log in to get started';
	}

	inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
	e.preventDefault();
	displayMovements(currentAccount.movements, !sorted);
	sorted = !sorted;
});

//flat
// const overallBalance = accounts
// 	.map((account) => account.movements)
// 	.flat()
// 	.reduce((acc, move) => acc + move, 0);

// console.log(overallBalance);

// //flatMap
// const overallBalance2 = accounts
// 	.flatMap((account) => account.movements)
// 	.reduce((acc, move) => acc + move, 0);

// console.log(overallBalance2);

// const euroToUsd = 1.1;

// const totalBalanceUsd = movements
// 	.filter((mov) => mov > 0)
// 	.map((mov) => mov * euroToUsd)
// 	.reduce((acc, cur) => acc + cur, 0);

// console.log(totalBalanceUsd);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//Sorting arrays
//strings
const owners = ['Jonas', 'Christiana', 'Zach', 'Gbenga'];
// console.log(owners.sort());
// console.log(owners);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// return < 0, a , b (keep order)
// return > 0, b , a (switch order)

//ASCENDING ORDER
// movements.sort((a, b) => {
// 	if (a > b) return 1;
// 	if (a < b) return -1;
// });
movements.sort((a, b) => a - b);
console.log(movements);

//DESCENDING ORDER
// movements.sort((a, b) => {
// 	if (a > b) return -1;
// 	if (a < b) return 1;
// });
movements.sort((a, b) => b - a);
console.log(movements);

// flat and flatMap methods
// const arr = [1, 2, 3, [4, 5, 6], 7, 9];
// console.log(arr.flat());

// const arrDeep = [[1, 2], 3, [4, [5, 6]], 7, 9];
// console.log(arrDeep.flat(2));

// const firstWithdrawal = movements.find((mov) => mov < 0);
// console.log(firstWithdrawal);

// const currencies = new Map([
// 	['USD', 'United States dollar'],
// 	['EUR', 'Euro'],
// 	['GBP', 'Pound sterling'],
// ]);

//reduce method
// const balance = movements.reduce((acc, cur) => acc + cur, 0);

// console.log(balance);

//filter method
// const deposits = movements.filter((movement) => movement > 0);
// console.log(deposits);

// const withdrawal = movements.filter((movement) => movement < 0);
// console.log(withdrawal);

//mapping method
// const movUSD = 1.1;

// const mappedMov = movements.map((movement) => movement * movUSD);

// console.log(mappedMov);

// const movDesc = movements.map((movement, i) => {
// 	return `Movement ${i + 1}: You ${
// 		movement > 0 ? 'deposited' : 'withdrew'
// 	} ${Math.abs(movement)}`;
// });

// console.log(movDesc);

// const arr = ['a', 'b', 'c', 'd', 'e'];

// //slice
// console.log(arr.slice(1, -1));
// console.log(arr.slice(2, 4));

// //splice
// console.log(arr.splice(-1));
// console.log(arr);

// // reverse
// const arr2 = ['j', 'i', 'g', 'h', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// //concat
// const letters = arr.concat(arr2);
// console.log(letters);

// //join
// console.log(letters.join('/'));

// // at method
// const array = [23, 11, 64];
// console.log(array.at(-1));
// console.log(array.at(0));

// //forEach method
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [i, movement] of movements.entries()) {
// 	if (movement > 0) {
// 		console.log(`Movement ${i + 1}: You deposited ${movement}`);
// 	} else {
// 		console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
// 	}
// }

// console.log('-----ForEach method -----');

// movements.forEach(function (movement, i, array) {
// 	if (movement > 0) {
// 		console.log(`Movement ${i + 1}: You deposited ${movement}`);
// 	} else {
// 		console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
// 	}
// });
