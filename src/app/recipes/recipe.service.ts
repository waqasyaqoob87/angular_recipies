import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
// import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService{
  recipesChanged = new Subject<Recipe[]>();
  
    // recipeSelected = new Subject<Recipe>(); 
    // private recipes:Recipe[]=[
    //     new Recipe(
    //       'Test Recipe',
    //       'Burger',
    //       'https://cdn2.howtostartanllc.com/images/business-ideas/business-idea-images/fast-food.jpg',
    //     [
    //         new Ingredient('Meat',1),
    //         new Ingredient('French Fries',20),
    //     ]),
    //     new Recipe(
    //       'Original Recipe',
    //       'Fries',
    //       'https://cdn2.howtostartanllc.com/images/business-ideas/business-idea-images/fast-food.jpg',
    //     [
    //         new Ingredient('Buns', 2),
    //         new Ingredient('Meat',5),
    //     ]),     
    //     new Recipe(
    //       'Origional Recipe',
    //       'Cold Drink',
    //       'https://cdn2.howtostartanllc.com/images/business-ideas/business-idea-images/fast-food.jpg',
    //     [
    //         new Ingredient('Buns', 2),
    //         new Ingredient('Meat',5),
    //     ]),
    //   ];
    private recipes: Recipe[] = [];
      constructor(private slService:ShoppingListService){}

      setRecipes(recipes: Recipe[]){
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice())
      }

      getRecipes(){
        return this.recipes.slice();
      }

      getRecipe(index:number){
        return this.recipes[index];
      }
      
      addIngredientToShoppingList(ingredients:Ingredient[]){
        this.slService.addIngredients(ingredients);
      }

      addRecipe(recipe:Recipe){
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
      }

      updateRecipe(index: number, newRecipe: Recipe){
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
      }
      deleteRecipe(index: number){
        this.recipes.splice(index,1);
        this.recipesChanged.next(this.recipes.slice());
      }
}