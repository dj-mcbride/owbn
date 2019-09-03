const message = ' ======================================================================================\n'
+ ' || Attention: When committing using this template, please make sure                 ||\n'
+ ' || no error pops up before pushing to remote repo.                                  ||\n'
+ ' || This template includes a pre-commit hook.                                        ||\n'
+ ' || The pre-commit lints your code, generates pronghorn.json, and validates it.      ||\n'
+ ' || In case any of the steps above failed, the hook would stop the commit.           ||\n'
+ ' || Please always check the message before proceeding.                               ||\n'
+ ' || Check README.md for more details                                                 ||\n'
+ ' ======================================================================================';
const update = ' ======================================================================================\n'
+ ' || After hooked up with the remote repo of your project.                            ||\n'
+ ' || Please use run `npm run update` to update modules from app-template              ||\n'
+ ' || Check README.md for more details                                                 ||\n'
+ ' ======================================================================================';
console.log(message);
console.log(update);
