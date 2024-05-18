<template>
  <!--Nav panel-->
  <div class="vc-nav-container" ref="navContainer">
    <!--Nav header-->
    <div class="vc-nav-header">
      <!--Move prev button-->
      <span role="button" class="vc-nav-arrow is-left" :class="{ 'is-disabled': !prevItemsEnabled }"
        :tabindex="prevItemsEnabled ? 0 : undefined" @click="movePrev" @keydown="e => onSpaceOrEnter(e, movePrev)">
        <slot name="nav-left-button">
          <svg-icon name="left-arrow" width="20px" height="24px" />
        </slot>
      </span>
      <!--Mode switch button-->
      <span role="button" class="vc-nav-title vc-grid-focus" :style="{ whiteSpace: 'nowrap' }" tabindex="0"
        @click="toggleMode" @keydown="e => onSpaceOrEnter(e, toggleMode)">
        {{ title }}
      </span>
      <!--Move next button-->
      <span role="button" class="vc-nav-arrow is-right" :class="{ 'is-disabled': !nextItemsEnabled }"
        :tabindex="nextItemsEnabled ? 0 : undefined" @click="moveNext" @keydown="e => onSpaceOrEnter(e, moveNext)">
        <slot name="nav-right-button">
          <svg-icon name="right-arrow" width="20px" height="24px" />
        </slot>
      </span>
    </div>
    <!--Navigation items-->
    <div class="vc-nav-items">
      <span v-for="item in activeItems" :key="item.label" role="button" :data-id="item.id" :aria-label="item.ariaLabel"
        :class="getItemClasses(item)" :tabindex="item.isDisabled ? undefined : 0" @click="item.click"
        @keydown="e => onSpaceOrEnter(e, item.click)">
        {{ item.label }}
      </span>
    </div>
  </div>
</template>

<script>
import SvgIcon from '../SvgIcon/SvgIcon.vue';
import { childMixin } from '../../utils/mixins';
import { get, head, last } from '../../utils/_';
import { onSpaceOrEnter, pad } from '../../utils/helpers';
import { getYear, getMonth, format } from 'date-fns-jalali';


const _yearGroupCount = 12;

export default {
  name: 'CalendarNav',
  emits: ['input'],
  components: {
    SvgIcon,
  },
  mixins: [childMixin],
  props: {
    value: { type: Object, default: () => ({ month: 0, year: 0 }) },
    validator: { type: Function, default: () => () => true },
  },
  data() {
    return {
      monthMode: true,
      yearIndex: 0,
      yearGroupIndex: 0,
      onSpaceOrEnter,
    };
  },
  computed: {
    month() {
      return this.value ? this.value.month || 0 : 0;
    },
    year() {
      return this.value ? this.value.year || 0 : 0;
    },
    title() {
      let _jalali = 0
      if (this.locale.id == "fa") {
        _jalali = 621
      }
      return this.monthMode
        ? this.yearIndex - _jalali
        : `${this.firstYear - _jalali} - ${this.lastYear - _jalali}`;
    },
    monthItems() {
      return this.getMonthItems(this.yearIndex);
    },
    yearItems() {
      return this.getYearItems(this.yearGroupIndex);
    },
    prevItemsEnabled() {
      return this.monthMode
        ? this.prevMonthItemsEnabled
        : this.prevYearItemsEnabled;
    },
    nextItemsEnabled() {
      return this.monthMode
        ? this.nextMonthItemsEnabled
        : this.nextYearItemsEnabled;
    },
    prevMonthItemsEnabled() {
      return this.getMonthItems(this.yearIndex - 1).some(i => !i.isDisabled);
    },
    nextMonthItemsEnabled() {
      return this.getMonthItems(this.yearIndex + 1).some(i => !i.isDisabled);
    },
    prevYearItemsEnabled() {
      return this.getYearItems(this.yearGroupIndex - 1).some(
        i => !i.isDisabled,
      );
    },
    nextYearItemsEnabled() {
      return this.getYearItems(this.yearGroupIndex + 1).some(
        i => !i.isDisabled,
      );
    },
    activeItems() {
      return this.monthMode ? this.monthItems : this.yearItems;
    },
    firstYear() {
      return head(this.yearItems.map(i => i.year));
    },
    lastYear() {
      return last(this.yearItems.map(i => i.year));
    },
  },
  watch: {
    year() {
      this.yearIndex = this.year;
    },
    yearIndex(val) {
      this.yearGroupIndex = this.getYearGroupIndex(val);
    },
    value() {
      this.focusFirstItem();
    },
  },
  created() {
    this.yearIndex = this.year;
  },
  mounted() {
    this.focusFirstItem();
  },
  methods: {
    focusFirstItem() {
      this.$nextTick(() => {
        // Set focus on the first enabled nav item
        const focusableEl = this.$refs.navContainer.querySelector(
          '.vc-nav-item:not(.is-disabled)',
        );
        if (focusableEl) {
          focusableEl.focus();
        }
      });
    },
    getItemClasses({ isActive, isCurrent, isDisabled }) {
      const classes = ['vc-nav-item'];
      if (isActive) {
        classes.push('is-active');
      } else if (isCurrent) {
        classes.push('is-current');
      }
      if (isDisabled) {
        classes.push('is-disabled');
      }
      return classes;
    },
    getYearGroupIndex(year) {
      return Math.floor(year / _yearGroupCount);
    },

    getMonthItems(year) {
      const today = new Date();
      const thisMonth = getMonth(today) + 1; // getMonth returns 0-11
      const thisYear = getYear(today);
      let len = 12
      if (this.locale.id == "fa") {
        len = 15
      }
      let _monthes = Array.from({ length: len }).map((_, i) => {

        const month = i + 1;
        const date = new Date(year, i, 1);

        return {
          month,
          year,
          id: `${year}.${pad(month, 2)}`,
          label: date.toLocaleDateString(this.locale.id , { month: 'short' }),
          ariaLabel: date.toLocaleDateString(this.locale.id , { month: 'short' }) + " " + year,
          isActive: month === this.month && year === this.year,
          isCurrent: month === thisMonth && year === thisYear,
          isDisabled: !this.validator({ month, year }),
          click: () => this.monthClick(month, year),
        };
      });
      if (this.locale.id == "fa") {
        _monthes = _monthes.slice(3)
      }
      return _monthes
    },

    getYearItems(yearGroupIndex) {
      const today = new Date();
      const thisYear = getYear(today);

      const startYear = yearGroupIndex * _yearGroupCount;
      const endYear = startYear + _yearGroupCount;
      let _jalali = 0
      if (this.locale.id == "fa") {
        _jalali = 621
      }
      return Array.from({ length: endYear - startYear }).map((_, i) => {
        const year = startYear + i;
        const enabled = Array.from({ length: 12 }).some((_, month) =>
          this.validator({ month: month + 1, year }),
        );

        return {
          year,
          id: year.toString(),
          label: year.toString() - _jalali,
          ariaLabel: year.toString(),
          isActive: year === this.year,
          isCurrent: year === thisYear,
          isDisabled: !enabled,
          click: () => this.yearClick(year),
        };
      });
    },
    monthClick(month, year) {
      if (this.validator({ month, year })) {
        this.$emit('input', { month, year });
      }
    },
    yearClick(year) {
      this.yearIndex = year;
      this.monthMode = true;
      this.focusFirstItem();
    },
    toggleMode() {
      this.monthMode = !this.monthMode;
    },
    movePrev() {
      if (!this.prevItemsEnabled) return;
      if (this.monthMode) {
        this.movePrevYear();
      }
      this.movePrevYearGroup();
    },
    moveNext() {
      if (!this.nextItemsEnabled) return;
      if (this.monthMode) {
        this.moveNextYear();
      }
      this.moveNextYearGroup();
    },
    movePrevYear() {
      this.yearIndex--;
    },
    moveNextYear() {
      this.yearIndex++;
    },
    movePrevYearGroup() {
      this.yearGroupIndex--;
    },
    moveNextYearGroup() {
      this.yearGroupIndex++;
    },
  },
};
</script>
