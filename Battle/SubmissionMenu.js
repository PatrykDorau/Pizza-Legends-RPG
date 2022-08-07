class SubmissionMenu {
  constructor({ caster, enemy, onComplete, items, replacements }) {
    this.caster = caster;
    this.enemy = enemy;
    this.replacements = replacements;
    this.onComplete = onComplete;

    let quantityMap = {};
    items.forEach(item => {
      if(item.team === caster.team) {
        let existing = quantityMap[item.actionId];

        if(existing) {
          existing.quantity += 1;
        } else {
          quantityMap[item.actionId] = {
            actionId: item.actionId,
            quantity: 1,
            instanceId: item.instanceId,
          }
        }
      }
    })
    this.items = Object.values(quantityMap);
    console.log(this.items);
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
            this.keyboardMenu.setOptions(this.getPages().replacements)
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
        ...this.items.map(item => {
          const action = actions[item.actionId];
          console.log(action, "action")
          return {
            label: action.name,
            description: action.description,
            right: () => {
              return "x" + item.quantity
            },
            handler: () => {
              this.menuSubmit(action, item.instanceId)
            }
          }
        }),
        backOption
      ],
      replacements: [
        ...this.replacements.map(replacement => {
          return {
            label: replacement.name,
            description: replacement.description,
            handler: () => {
              this.menuSubmitReplacement(replacement)
            }
          }
        }),
        backOption
      ]
    }
  }

  menuSubmitReplacement(replacement) {
    this.keyboardMenu?.end();
    this.onComplete({
      replacement
    })
  }

  menuSubmit(action, instanceId=null) {
    this.keyboardMenu?.end();

    this.onComplete({
      action,
      target: action.targetType === "friendly" ? this.caster : this.enemy,
      instanceId
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