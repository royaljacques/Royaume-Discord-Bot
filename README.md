# Bot du Royaume

### Comment contribuer ?  
Pour chaque contribution vous devrez créer une branch depuis la branch "main" et faire vos commits sur celle-ci, il faudra aussi mettre en place une pull request à partir de votre branch (cette option sera affichée directement sur [cette page](https://github.com/Virtual-Royaume/Royaume-Discord-Bot) une fois votre branch crée).

Une fois que vous avez fini de travailler sur vos ajouts vous devrez mentionner Bluzzi dans le salon #développement du Discord avec le lien de votre pull request, à partir de la vous pouvez laisser cette branch, Bluzzi s'occupera de la merge avec la branch main.

Bonne pratiques :
- créer une branch différente pour chaque changement/ajout, exemple : si vous travaillez sur la modification du système de commande vous ne devriez pas mettre des commits sur un système d'expérience selon le nombre de messages des utilisateurs
- mettre un nom et une description sur vos pull requests, on s'y retrouve mieux comme ça ! Exemple :
![](https://i.imgur.com/zmjPGdC.png)
- ne pas laisser trop longtemps une branch sans demander à la merge pour éviter d'avoir trop de changement entre votre branch et la branch main (ou alors pensez à combiner la branch main avec la votre une fois de temps en temps)

### Quelques trucs à savoir avant de passés à l'action :  
Dans le dossier "resources" à la racine du projet il y a des fichiers avec un tiret du bas devant leur nom, vous devrez créer une copie de ses fichiers (attention : sans les supprimer) en retirant le tiret du bas. Ensuite vous devrez complèter quelques informations dans ses fichiers (tout sera expliqué à l'intérieur de ses fichiers).

Vous pouvez lancer le projet en mode développement via la commande ``npm run dev`` dans votre console. Une fois cela fait, le bot se lancera et il redémarrera après chaque sauvegarde d'un fichier du projet.

Partout dans le projet, vous pouvez facilement accéder à l'instance du Client (qui est extends de DiscordJS.Client) via ``Client.instance``

Pour créer une commande ou un event, il vous suffit uniquement de copier/collé un fichier de commande/event existant et de le ranger dans une catégorie de commande ou dans le dossier "list" des events. C'est tout, l'event ou la commande sera automatiquement chargée au lancement du bot.

Si vous ne savez pas quoi faire mais que vous avez envie de participer au développement, il y a une liste des choses à faire ci-dessous !

### Une liste des choses que vous pouvez faire :
> Ici vous pouvez ajouter des fonctionnalités que vous aimeriez voir sur le bot même si vous ne souhaitez pas vous en occuper. Si vous voulez vous occuper d'une des choses à faire, ajouter votre pseudo sur la ligne.
- [ ] Ajouter des choses à faire...