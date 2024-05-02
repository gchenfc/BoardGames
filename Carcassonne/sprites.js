import createSprite from "../util/sprites.js";
import { Card } from "./cards.js";

// https://en.wikipedia.org/wiki/Carcassonne_(board_game)#
export const SPRITES = {
  "0r0c_R0+M": createSprite("sprites/pieces/0r0c_R0+M.svg"),
  "0r0c_R1": createSprite("sprites/pieces/0r0c_R1.svg"),
  "0r0c_R2_(A)": createSprite("sprites/pieces/0r0c_R2_(A).svg"),
  "0r0c_R2_(B)": createSprite("sprites/pieces/0r0c_R2_(B).svg"),
  "0r1c_R0": createSprite("sprites/pieces/0r1c_R0.svg"),
  "0r2c_R0_(A)": createSprite("sprites/pieces/0r2c_R0_(A).svg"),
  "0r2c_R0_(B)": createSprite("sprites/pieces/0r2c_R0_(B).svg"),
  "0r2c_R0_(C)+C": createSprite("sprites/pieces/0r2c_R0_(C)+C.svg"),
  "0r2c_R0_(C)": createSprite("sprites/pieces/0r2c_R0_(C).svg"),
  "0r2c_R0_(D)+C": createSprite("sprites/pieces/0r2c_R0_(D)+C.svg"),
  "0r2c_R0_(D)": createSprite("sprites/pieces/0r2c_R0_(D).svg"),
  "0r2c_R2_(A)": createSprite("sprites/pieces/0r2c_R2_(A).svg"),
  "0r2c_R2_(B)": createSprite("sprites/pieces/0r2c_R2_(B).svg"),
  "0r3c_R0+C": createSprite("sprites/pieces/0r3c_R0+C.svg"),
  "0r3c_R0": createSprite("sprites/pieces/0r3c_R0.svg"),
  "0r4c_R0+C": createSprite("sprites/pieces/0r4c_R0+C.svg"),
  "1r0c_R0+M": createSprite("sprites/pieces/1r0c_R0+M.svg"),
  "1r0c_R2+M": createSprite("sprites/pieces/1r0c_R2+M.svg"),
  "1r1c_R2": createSprite("sprites/pieces/1r1c_R2.svg"),
  "1r3c_R0+C": createSprite("sprites/pieces/1r3c_R0+C.svg"),
  "1r3c_R0": createSprite("sprites/pieces/1r3c_R0.svg"),
  "2r0c_R0_(A)": createSprite("sprites/pieces/2r0c_R0_(A).svg"),
  "2r0c_R0_(B)": createSprite("sprites/pieces/2r0c_R0_(B).svg"),
  "2r0c_R2_(A)": createSprite("sprites/pieces/2r0c_R2_(A).svg"),
  "2r0c_R2_(B)": createSprite("sprites/pieces/2r0c_R2_(B).svg"),
  "2r1c_R0_(A)": createSprite("sprites/pieces/2r1c_R0_(A).svg"),
  "2r1c_R0_(B)": createSprite("sprites/pieces/2r1c_R0_(B).svg"),
  "2r1c_R0_(C)": createSprite("sprites/pieces/2r1c_R0_(C).svg"),
  "2r2c_R0+C": createSprite("sprites/pieces/2r2c_R0+C.svg"),
  "2r2c_R0": createSprite("sprites/pieces/2r2c_R0.svg"),
  "3r0c_R0+V": createSprite("sprites/pieces/3r0c_R0+V.svg"),
  "3r1c_R0+V": createSprite("sprites/pieces/3r1c_R0+V.svg"),
  "4r0c_R0+V": createSprite("sprites/pieces/4r0c_R0+V.svg"),
};

Card.sprite = () => SPRITES[this.key];
