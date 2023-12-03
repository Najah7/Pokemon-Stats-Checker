import {
  currentTextLength,
  specialAttackCount,
  specialDiffenceCount,
  typeCount,
  typoCount,
} from "./extension";
import { f } from "./function";
import { startTime } from "./start";
import { Stats } from "./types/pokemons";

export const calcStats = (): Stats => {
  // Constants for calculations
  const baseHp: number = 300;
  const baseDefense: number = 110;
  const baseSpecialDefense: number = 100;
  const baseSpeed: number = 155;
  const specialAttackCoefficients: number = 10;
  const specialDiffenceCoefficients: number = 2;

  // 経過時間を計算
  const elapsedTime = (Date.now() - startTime) / 1000; // ミリ秒から秒に変換

  // H: HP(冗長さ、文字数)
  const h: number = f(baseHp - currentTextLength);

  // A: こうげき（タイピング率=キータイプ回数/経過時間)
  const typingRate = (typeCount / elapsedTime) * 100;
  const a: number = f(typingRate);

  // B: ぼうぎょ(タイポ率=1文字削除回数/経過時間)
  const typoRate = (typoCount / elapsedTime) * 100;
  const b: number = f(baseDefense - typoRate);

  // C: とくこう(ペースト、インラインサジェスト)
  const specialAttackRate = (specialAttackCount / elapsedTime) * 100;
  const specialAttack = specialAttackRate * specialAttackCoefficients;
  const c: number = f(specialAttack);

  // D: とくぼう(選択範囲削除)
  const specialDiffenceRate = (specialDiffenceCount / elapsedTime) * 100;
  const specialDiffence = specialDiffenceCoefficients * specialDiffenceRate;
  const d: number = f(baseSpecialDefense - specialDiffence);

  // S: すばやさ(完成までの時間)
  const s: number = f(baseSpeed - elapsedTime);

  // 種族値を返す
  return {
    hp: h,
    attack: a,
    defense: b,
    specialAttack: c,
    specialDefense: d,
    speed: s,
  };
};
