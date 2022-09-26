// import { EventEmitter } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
export class ShoppingListService{
  startedEditing = new Subject<number>();
    ingredientsChanged = new Subject<Ingredient[]>();
    private ingredients:Ingredient[]=[
        new Ingredient('Apple',7),
        new Ingredient('carrot',12),
      ];
      getIngredients(){
        return this.ingredients ;
      }
      getIngredient(index:number){
        return this.ingredients[index];
      }
      addIngredient(ingredient:Ingredient){
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice());
      }
      addIngredients(ingredients:Ingredient[]){
        // for(let ingredient of ingredients){
        //   this.addIngredient(ingredient);
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.next(this.ingredients.slice());
        }

        updateIngredient(index: number, newIngredient:Ingredient){
          this.ingredients[index] = newIngredient;
          this.ingredientsChanged.next(this.ingredients.slice());
        }
        deleteIngredient(index: number){
          this.ingredients.splice(index,1);
          this.ingredientsChanged.next(this.ingredients.slice());
        }
      }
