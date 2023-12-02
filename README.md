# Pokemon Stats Checker ~for Engineers~

## Description
This App is a vscode extension.<br/>
It has a lot of features. 
- collect your coding metrics.
- calculate pokemon base stats by your coding feature (in our original algorithm)
- find a pokemon that has similar feature with your stats by using open pokemon data.
- generate an awesome radar chart from your coding feature.
- share it with your friends by putting a graph photo on your github profile.

## As a Side Note
- we just support 1st generation pokemon. (id 1 ~ 151)
- we can just store your previous metrics data and 1 graph image because of our financial problem.

## How to install
We are writing about this soon.

## How to use
![demo](https://github.com/Najah7/Pokemon-Stats-Checker/assets/79052634/aea6b269-2385-4fb4-a002-acefdc0db0cf.gif)





## What is Pokemon Base Stats?

We will monitor your coding activities within VSCode and evaluate them quantitatively using six metrics (hp, attack, defense, special attack, special defense, speed). The goal is to objectively assess your coding skills and potentially assist in grading coding assessments for companies. Additionally, user input logs will be saved in CSV format, paving the way for future possibilities of quantitative and automated coding evaluations through machine learning. However, current functionality is limited to confirming your coding characteristics, akin to discovering a perfect partner when compared to Pokémon base stats. So, let's proceed to solve the coding challenges and explore your coding traits in comparison to Pokémon base stats.

All metrics are evaluated on a scale of 0-150.

- **HP**: Assesses code redundancy, emphasizing that shorter code doesn't necessarily equate to higher scores. It serves as an indicator of character count. However, excessively redundant code, which can lead to unexpected errors, is evaluated with lower scores.

- **Attack**: Calculated from the type rate, with a higher rate resulting in a higher score. 

- **Defense**: Derived from the typo rate, with a higher rate leading to lower scores. A high typo rate may indicate a higher frequency of post-execution proofreading for careless mistakes.

- **Special Attack**: Indirectly detects and evaluates quoting or Copilot usage. Specifically, it calculates and evaluates the rate of input with two or more characters. While Attack assesses the user's scratch skills and typing speed, Special Attack gauges the ability to leverage the internet and AI. The utilization of AI is considered a crucial skill for future engineers.

- **Special Defense**: Calculated based on the usage rate of range selection deletion. A higher deletion frequency results in lower scores.

- **Speed**: Evaluated based on the time taken to complete problem-solving, with higher scores for quicker completion times.

## How to contribute
We are writing about this soon.


