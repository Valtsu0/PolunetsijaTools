"use strict";

class PageFilterVariantRules extends PageFilter {
	// region static
	// endregion

	constructor () {
		super();

		this._sourceFilter = new SourceFilter();
		this._ruleCategoryFilter = new Filter({header: "Rule Category", headerHelp: "Variant - Heavily Adds to or Modifies the Game Rules\nOptional - Adds new content to the game\nSubsystem - Rules for running specific types of encounters\nAdventure - Adventure-specific Rulesets"});
		this._subCategoryFilter = new Filter({
			header: "Subcategory",
			nests: {},
		});
		this._ruleRarityFilter = new Filter({header: "Rarity"});
	}

	mutateForFilters (rule) {
		rule._fSources = SourceFilter.getCompleteFilterSources(rule);
		if (rule.rarity) rule._fRarity = rule.rarity.toTitleCase();
		rule._fSubCategory = rule.subCategory ? new FilterItem({
			item: rule.subCategory,
			nest: rule.category,
		}) : null;
	}

	addToFilters (rule, isExcluded) {
		if (isExcluded) return;

		this._sourceFilter.addItem(rule._fSources);
		if (rule.category) this._ruleCategoryFilter.addItem(rule.category);
		if (rule._fRarity) this._ruleRarityFilter.addItem(rule._fRarity);
		if (rule._fSubCategory) {
			this._subCategoryFilter.addNest(rule.category, {isHidden: true})
			this._subCategoryFilter.addItem(rule._fSubCategory);
		}
	}

	async _pPopulateBoxOptions (opts) {
		opts.filters = [
			this._sourceFilter,
			this._ruleCategoryFilter,
			this._subCategoryFilter,
			this._ruleRarityFilter,
		];
	}

	toDisplay (values, r) {
		return this._filterBox.toDisplay(
			values,
			r._fSources,
			r.category,
			r._fSubCategory,
			r._fRarity,
		)
	}
}
