# Redact
Experimental facade for react/redux. Hoping to smooth things over and wrap up everything needed.

- All components receive props, state, and dispatch
- Use state over props as much as possible
- Enforced Flux Standard Action concept
- Enforced one handler per action: leave no question as to who might be listening
- Decouple data shape from UI hierarchy shape
- Still needs similarly minimalistic approach to pure effect handling
