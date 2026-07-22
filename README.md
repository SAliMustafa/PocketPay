# Project Name

## Overview

## Screenshots

## Technologies Used

https://pocketpay.com/pay?amount=240?user=skyradar

## Getting Started

## Installation

## User Stories

- As a guest, I want to sign up for an account with a username and password, so that I can start using the app.
- As a guest, I want to log in with my username and password, so that I can access my cards and transaction history.
- As a logged-in user, I want to view my total balance (summed across all my cards) on my dashboard, so that I know how much money I have overall. (changed — total is now computed from cards, not a wallet)
- As a logged-in user, I want to add a new card, so that I have a place to hold and manage a balance. (changed — card now holds its own balance)
- As a logged-in user, I want to view, edit, and delete my cards, so that I can keep my funding sources and balances up to date.
- As a logged-in user, I want to deposit money into a specific card, so that that card's balance increases.
- As a logged-in user, I want to withdraw money from a specific card, so that that card's balance decreases.
- As a logged-in user, I want to choose which of my cards to send money from when transferring to another user, so that I can control which balance is used.
- As a logged-in user, I want to view a full transaction history per card (or filtered by card), so that I can track where each card's money has gone.
- As a logged-in user, I want to see the counterparty's username on transfer transactions, so that I know who I sent money to or received money from.

## Database Design



## Routes

### Auth Routes

| Method | Route      | Description                          |
|--------|------------|---------------------------------------|
| GET    | /sign-up   | Render sign-up form                   |
| POST   | /sign-up   | Create new user, log them in          |
| GET    | /sign-in   | Render sign-in form                   |
| POST   | /sign-in   | Authenticate user, create session     |
| GET    | /sign-out  | Log out user, destroy session         |

### Card Routes

| Method | Route            | Description                                  |
|--------|-------------------|-----------------------------------------------|
| GET    | /cards            | Index — list all of the logged-in user's cards |
| GET    | /cards/new        | Render form to add a new card                |
| POST   | /cards            | Create a new card                            |
| GET    | /cards/:cardId    | Show a single card's details + its transactions |
| GET    | /cards/:cardId/edit | Render form to edit a card                 |
| PUT    | /cards/:cardId    | Update a card's details (nickname, expiry, etc.) |
| DELETE | /cards/:cardId    | Delete a card                                |

### Transaction Routes

| Method | Route                                | Description                                   |
|--------|----------------------------------------|------------------------------------------------|
| GET    | /cards/:cardId/transactions/new-deposit    | Render form to deposit into a card         |
| POST   | /cards/:cardId/transactions/deposit        | Create a deposit transaction               |
| GET    | /cards/:cardId/transactions/new-withdrawal | Render form to withdraw from a card        |
| POST   | /cards/:cardId/transactions/withdrawal     | Create a withdrawal transaction            |
| GET    | /cards/:cardId/transactions/new-transfer   | Render form to transfer to another user    |
| POST   | /cards/:cardId/transactions/transfer       | Create the transfer_out + transfer_in pair |


## Features



## Future Enhancements



## Credits


# PocketPay
