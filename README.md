# Footlocker Checkout Tool 👟

Hello everyone! 👋

Welcome to the repository of Footlocker Checkout Tool. This tool was developed to automate the checkout process for Footlocker.

## Contents 📦
- `footlocker.js`: The main file that handles the checkout process on Footlocker.
- `ayden.js`: A script that handles payment processing using Ayden.
- `datadome.js`: A script that helps to bypass the DataDome bot protection.
- `cartInfo.json`: A JSON file that is used to store the response of the checkout attempt.

## Status 🚧
**Note**: This tool was developed in 2021 and is probably not working anymore due to changes in Footlocker's website and bot protection mechanisms. You are free to use the code or open pull requests if you think you have added something valuable. However, issues will not be looked at since we, ceodavee and vihangatheturtle, are not working in the sneaker scene anymore.

## Authors 👨‍💻
- ceodavee - [github.com/ceodavee](https://github.com/ceodavee)
- vihangatheturtle - [github.com/vihangatheturtle](https://github.com/vihangatheturtle)

## Configuring footlocker.js 🔧

You need to fill in your own information in the `footlocker.js` file before running the tool. 

Here is the part of the `footlocker.js` file that you need to fill:

```javascript
var webhook = ""; //static discord goes here

var profile = {
    "name": "Your Name",
    ...
    ...
    "cardCvv": "Your Card CVV"
}

var task = {
    "mode": "Inital",
    ...
    ...
    "taskID": "Your Task ID"
}
```

- `webhook`: The static Discord webhook URL.
- `profile`: Your profile information, including billing and shipping addresses and payment details.
- `task`: The task configuration, including mode, monitor input, profile, proxies, delays, sizes, color, site, quantity, and task ID.

Fill in your own information in the `profile` and `task` objects, and set your own webhook URL.

## cartInfo.json 🍪

The `cartInfo.json` file is used to store the response of the checkout attempt. It will be filled automatically by the script. When the script attempts to checkout, it will save the response to this file, whether it is a success or a decline.

## Contributing 🤝
Feel free to use this code as a reference or contribute to it by opening a pull request. We would love to see what you can add to this tool. Unfortunately, we will not be able to review any issues as we are not active in this scene anymore.

## Disclaimer ❗
This tool was developed for educational purposes only. We are not responsible for any misuse of this tool or any damages caused by it. Use it at your own risk.

Thank you for stopping by! 💙

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=d-suter/footlocker-bot&type=Date)](https://star-history.com/#d-suter/footlocker-bot&Date)
