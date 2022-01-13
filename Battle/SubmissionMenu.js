class SubmissionMenu {
  constructor({ caster, enemy, onComplete}) {
    this.caster = caster;
    this.enemy = enemy;
    this.onComplete = onComplete;
  }

  decide() {
    this.onComplete({
      action: actions[this.caster.actions[0]],
      target: this.enemy
    })
  }

  init(container) {
    this.decide()
  }
}