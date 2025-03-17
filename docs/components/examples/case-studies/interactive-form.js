/**
 * Case Study: Interactive Form with Validation
 *
 * This example demonstrates:
 * - Form handling with real-time validation
 * - Reactive UI updates based on input state
 * - Complex form state management
 * - Clean separation of concerns (data, validation, UI)
 */

import { dispatchEvent, el, on, scope } from "deka-dom-el";
import { S } from "deka-dom-el/signals";

/**
 * @typedef {Object} FormState
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} confirmPassword
 * @property {boolean} agreedToTerms
 * */
/**
 * Interactive Form with Validation Component
 * @returns {HTMLElement} Form element
 */
export function InteractiveForm() {
	const submitted = S(false);
	/** @type {FormState|null} */
	let formState = null;
	/** @param {CustomEvent<FormState>} event */
	const onSubmit = ({ detail }) => {
		submitted.set(true);
		formState = detail;
	};
	const onAnotherAccount = () => {
		submitted.set(false)
		formState = null;
	};

	return el("div", { className: "form-container" }).append(
		S.el(submitted, s => s
			? el("div", { className: "success-message" }).append(
				el("h3", "Thank you for registering!"),
				el("p", `Welcome, ${formState.name}! Your account has been created successfully.`),
				el("button", { textContent: "Register another account", type: "button" },
					on("click", onAnotherAccount)
				),
			)
			: el(Form, { initial: formState }, on("form:submit", onSubmit))
		)
	);
}
/**
 * Form Component
 * @type {(props: { initial: FormState | null }) => HTMLElement}
 * */
export function Form({ initial }) {
	const { host }= scope;
	// Form state management
	const formState = S(initial || {
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		agreedToTerms: false
	}, {
		/**
		 * @template {keyof FormState} K
		 * @param {K} key
		 * @param {FormState[K]} value
		 * */
		update(key, value) {
			this.value[key] = value;
		}
	});
	/**
	 * Event handler for input events
	 * @param {"value"|"checked"} prop
	 * @returns {(ev: Event) => void}
	 * */
	const onChange= prop => ev => {
		const input = /** @type {HTMLInputElement} */(ev.target);
		S.action(formState, "update", /** @type {keyof FormState} */(input.id), input[prop]);
	};

	// Form validate state
	const nameValid = S(() => formState.get().name.length >= 3);
	const emailValid = S(() => {
		const email = formState.get().email;
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	});
	const passwordValid = S(() => {
		const password = formState.get().password;
		return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
	});
	const passwordsMatch = S(() => {
		const { password, confirmPassword } = formState.get();
		return password === confirmPassword && confirmPassword !== '';
	});
	const termsAgreed = S(() => formState.get().agreedToTerms);
	const formValid = S(() =>
		nameValid.get() &&
		emailValid.get() &&
		passwordValid.get() &&
		passwordsMatch.get() &&
		termsAgreed.get()
	);

	const dispatcSubmit = dispatchEvent("form:submit", host);
	const onSubmit = on("submit", e => {
		e.preventDefault();
		if (!formValid.get()) {
			return;
		}

		dispatcSubmit(formState.get());
	});

	// Component UI
	return el("form", { className: "registration-form" }, onSubmit).append(
		el("h2", "Create an Account"),

		// Name field
		el("div", { classList: {
			"form-group": true,
			valid: nameValid,
			invalid: S(()=> !nameValid.get() && formState.get().name)
		}}).append(
			el("label", { htmlFor: "name", textContent: "Full Name" }),
			el("input", {
				id: "name",
				type: "text",
				value: formState.get().name,
				placeholder: "Enter your full name"
			}, on("input", onChange("value"))),
			el("div", { className: "validation-message", textContent: "Name must be at least 3 characters long" }),
		),

		// Email field
		el("div", { classList: {
			"form-group": true,
			valid: emailValid,
			invalid: S(()=> !emailValid.get() && formState.get().email)
		}}).append(
			el("label", { htmlFor: "email", textContent: "Email Address" }),
			el("input", {
				id: "email",
				type: "email",
				value: formState.get().email,
				placeholder: "Enter your email address"
			}, on("input", onChange("value"))),
			el("div", { className: "validation-message", textContent: "Please enter a valid email address" })
		),

		// Password field
		el("div", { classList: {
			"form-group": true,
			valid: passwordValid,
			invalid: S(()=> !passwordValid.get() && formState.get().password)
		}}).append(
			el("label", { htmlFor: "password", textContent: "Password" }),
			el("input", {
				id: "password",
				type: "password",
				value: formState.get().password,
				placeholder: "Create a password"
			}, on("input", onChange("value"))),
			el("div", {
				className: "validation-message",
				textContent: "Password must be at least 8 characters with at least one uppercase letter and one number",
			}),
		),

		// Confirm password field
		el("div", { classList: {
			"form-group": true,
			valid: passwordsMatch,
			invalid: S(()=> !passwordsMatch.get() && formState.get().confirmPassword)
		}}).append(
			el("label", { htmlFor: "confirmPassword", textContent: "Confirm Password" }),
			el("input", {
				id: "confirmPassword",
				type: "password",
				value: formState.get().confirmPassword,
				placeholder: "Confirm your password"
			}, on("input", onChange("value"))),
			el("div", { className: "validation-message", textContent: "Passwords must match" }),
		),

		// Terms agreement
		el("div", { className: "form-group checkbox-group" }).append(
			el("input", {
				id: "agreedToTerms",
				type: "checkbox",
				checked: formState.get().agreedToTerms
			}, on("change", onChange("checked"))),
			el("label", { htmlFor: "agreedToTerms", textContent: "I agree to the Terms and Conditions" }),
		),

		// Submit button
		el("button", {
			textContent: "Create Account",
			type: "submit",
			className: "submit-button",
			disabled: S(() => !formValid.get())
		}),
	);
}

// Render the component
document.body.append(
	el("div", { style: "padding: 20px; background: #f5f5f5; min-height: 100vh;" }).append(
		el(InteractiveForm)
	),
	el("style", `
		.form-container {
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
			max-width: 500px;
			margin: 0 auto;
			padding: 2rem;
			border-radius: 8px;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
			background: #fff;
		}

		h2 {
			margin-top: 0;
			color: #333;
			margin-bottom: 1.5rem;
		}

		.form-group {
			margin-bottom: 1.5rem;
			position: relative;
			transition: all 0.3s ease;
		}

		label {
			display: block;
			margin-bottom: 0.5rem;
			color: #555;
			font-weight: 500;
		}

		input[type="text"],
		input[type="email"],
		input[type="password"] {
			width: 100%;
			padding: 0.75rem;
			border: 1px solid #ddd;
			border-radius: 4px;
			font-size: 1rem;
			transition: border-color 0.3s ease;
		}

		input:focus {
			outline: none;
			border-color: #4a90e2;
			box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
		}

		.checkbox-group {
			display: flex;
			align-items: center;
		}

		.checkbox-group label {
			margin: 0 0 0 0.5rem;
		}

		.validation-message {
			font-size: 0.85rem;
			color: #e74c3c;
			margin-top: 0.5rem;
			height: 0;
			overflow: hidden;
			opacity: 0;
			transition: all 0.3s ease;
		}

		.form-group.invalid .validation-message {
			height: auto;
			opacity: 1;
		}

		.form-group.valid input {
			border-color: #2ecc71;
		}

		.form-group.invalid input {
			border-color: #e74c3c;
		}

		.submit-button {
			background-color: #4a90e2;
			color: white;
			border: none;
			border-radius: 4px;
			padding: 0.75rem 1.5rem;
			font-size: 1rem;
			cursor: pointer;
			transition: background-color 0.3s ease;
			width: 100%;
		}

		.submit-button:hover:not(:disabled) {
			background-color: #3a7bc8;
		}

		.submit-button:disabled {
			background-color: #b5b5b5;
			cursor: not-allowed;
		}

		.success-message {
			text-align: center;
			color: #2ecc71;
		}

		.success-message h3 {
			margin-top: 0;
		}

		.success-message button {
			background-color: #2ecc71;
			color: white;
			border: none;
			border-radius: 4px;
			padding: 0.75rem 1.5rem;
			font-size: 1rem;
			cursor: pointer;
			margin-top: 1rem;
		}

		.success-message button:hover {
			background-color: #27ae60;
		}
	`),
);
