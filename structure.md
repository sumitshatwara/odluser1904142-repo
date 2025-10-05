# Site structure

```bash
car-dealership/
│
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   ├── images/
│   │   ├── logo.png
│   │   ├── showroom.png
│   │   └── service_center.png
│   └── index.html
│
├── data/
│   └── cars.json
│
├── views/
│   └── inventory.mustache
│
├── app.js
├── package.json
└── README.md

```

To test this code locally you will need node / rpm (node v22.3.0)

IF you don't have node already on your machine: 

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

Then run

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

THEN
nvm install node 20

