class SubmissionMenu {
  constructor({ caster, enemy, onComplete}) {
    this.caster = caster;
    this.enemy = enemy;
    this.onComplete = onComplete;
  }

  getPages() {

    const backOption = {
      label: "Go Back",
      description: "Return to previous page",
      handler: () => {
        this.keyboardMenu.setOptions(this.getPages().root)
      }
    }

    return {
      root: [
        {
          label: "Attack",
          description: "Choose the attack",
          handler: () => {
            this.keyboardMenu.setOptions(this.getPages().attacks)
          }
        },
        {
          label: "Items",
          description: "Choose the item",
          handler: () => {
            this.keyboardMenu.setOptions(this.getPages().items)
          }
        },
        {
          label: "Swap",
          description: "Choose another pizza",
          handler: () => {
            //Zrób coś!
          }
        },
      ],
      attacks: [
        ...this.caster.actions.map(key => {
          const action = actions[key];
          console.log(action, "action")
          return {
            label: action.name,
            description: action.description,
            handler: () => {
              this.menuSubmit(action)
            }
          }
        }),
        backOption
      ],
      items: [
        backOption
      ]
    }
  }

  menuSubmit(action, instanceId=null) {

    this.keyboardMenu?.end();

    this.onComplete({
      action,
      target: action.targetType === "friendly" ? this.caster : this.enemy,
    })

  }

  showMenu(container) {
    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(container);
    this.keyboardMenu.setOptions(this.getPages().root);
  }

  decide() {
    //Przeciwnicy wybieraja losowo co zrobic
    this.menuSubmit(actions[ this.caster.actions[0] ])
  }

  init(container) {

    if(this.caster.isPlayerControlled) {
      //Pokazemy menu wybory akcji
      this.showMenu(container)
    } else {
      this.decide()
    }

  }
}