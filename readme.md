# Problem Statement
Create this simple application using the Ruby/Rails framework and/or language you are most comfortable with. Write functional code in the most efficient manner and with your best workmanship. Focus on showing us clear logic, your best practices, and your methodologies/design patterns – your choice of these is part of the review process. The results do not need to be perfect or polished. Don't try to future-proof the app, either. We're fans of simple, concise code that includes unit tests.

You're building a website that has a "Car Repair Appointment" feature:
1. The user requests an appointment and provides their email address.  The website sends an activation email to their email account.
2. The user clicks a link in an activation email, which takes them to a form where they enter their first name, last name, phone number, year, make, model, repair required, and preferred appointment date/time.
3. Once this form is submitted they should be presented with a success screen and a confirmation email should be sent to the user. A "Car Repair Appointment" email should be delivered to repairs@example.com with the user's information, their car repair request information, appointment date/time, and the IP address used to fill out the form.
4. If the user clicks the activation email link or tries to fill out the form again, the user should be presented with their already submitted data (except the ip address), with an opportunity to rate their experience on a scale of 1-5.

Views don't need to be styled in any way; plain HTML elements with no CSS at all is fine. You can use whatever libraries, gems or packages you want.

------------
# How To Use
1. Clone/download the repo to your machine:
	- `git clone https://github.com/AHazy/car_repair.git`
2. Install the required node modules:
	- `npm i`
3. Start the server:
	- `npm start`
	- or `npm run debug` allows you to change files without having to manually restart the server everytime
4. Point your browser to http://localhost:8080/
5. Have fun breaking my code!

### Supplied Gmail Account
- The program is currently setup with the following Gmail account:
	- email: car.repair.appointment@gmail.com
	- password: G5AutoShop
- Feel free to use and abuse this account.
- You may need to login and "review activity" since you will be accessing the email from a new IP.
- This email is currently being used as the "company" email to receive the appointment details.
	- Feel free to change the "company" email to whatever you like on line 144 of `server.js`.

##### If you want to change the email account:
- It will have to be a Gmail account unless you want to change the nodemailer configuration.
- To change the sender email:
	- Change the credentials on lines 21 and 22 in `modules/sendEmail.js`
	- Also change the "from" field on line 28 in `modules/sendEmail.js`
