# API — BigDataEtMoi

API de l'application BigDataEtMoi réalisé en NodeJS, Express, TypeScript et MongoDB.

## Prise en main

Ces instructions vous permettront d'obtenir une copie fonctionnelle du projet sur votre machine locale.

### Prérequis

-   [Node](https://nodejs.org/en/download/)
-   [Yarn](https://yarnpkg.com/lang/en/docs/install/#windows-stable) - Gestionnaire de dépendances
-   [MongoDB (Community Edition)](https://docs.mongodb.com/v3.2/tutorial/install-mongodb-on-windows/) - Base de données orientée documents
-   [NoSQLBooster](https://nosqlbooster.com/downloads) ou [MongoDB Compass](https://www.mongodb.com/products/compass) - GUI pour MongoDB
-   [Python](https://www.python.org/download/releases/2.7/) - Python 2.7

### Installation

Cloner le projet

```bash
git clone https://github.com/BigDataEtMoiProject/backend
```

Se placer dans le dossier de ce dernier

```bash
cd ./backend
```

Vider le cache lié aux dépendances

```bash
yarn cache clean
```

Sur Windows, ajoutez cette dépendance en tant qu'administrateur

```bash
yarn add global --prod windows-build-tools
```

Installer les dépendances

```bash
yarn install
```

Exécuter et laisser tourner les deux services dans le terminal
`mongod` et `mongo`

Copier le fichier de configuration .env en local

```bash
cp .env.example .env
```

Lancer les migrations

```bash
yarn setup
```

Lancer le serveur

```bash
yarn serve
```

Utiliser NoSQLBooster/MongoDB Compass pour visualiser la base de donnée

<i>Valeurs par défaut pour se connecter à la BDD

-   host: localhost
-   port: 27017
    </i>

### Lancer les tests

Pour faire fonctionner les tests, il faut au préalable créer une base de données portant le nom `bigdataetmoi_test`.

-   <i>e2e</i>

```bash
yarn start test.e2e
```

-   <i>unitaires</i>

```bash
yarn start test
```
