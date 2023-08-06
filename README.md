# Billatory

Bailatory is a Desktop app for print students Bills.

![dashboard](./screenshots/dashboard.png)

## Technologies used
1. React
1. MaterailUi
1. Typescript
1. Tauri
1. Sqlite

*Design Inspired from [mantis-free-admin-template](https://github.com/codedthemes/mantis-free-react-admin-template/tree/main/src)*

## Installation guild

### Prerequisite
- Rust, cargo
- Nodejs and a package manager

### Steps 

1. [installing tauri](https://tauri.app/v1/guides/getting-started/prerequisites)

2. clone repo 
```
git clone https://github.com/AashisMhj/billatory.git
```

3. install packages  
**Before install package change the command in tauri.config from yarn to the package manager you are using**
```bash
# install cargo packages
cd src-tauri
cargo build
## install npm packages
cd ..
yarn

## running in development mode
yarn tauri dev

## build 
yarn tauri build
```