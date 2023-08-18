<template>
  <div v-if="show">
    <b-form class="widget-config-container">
      <b-form-group :label="$t('fm.config.widget.name')">
        <b-input v-model="data.name"></b-input>
      </b-form-group>
      <b-form-group v-if="data.hasModel" :label="$t('fm.config.widget.model')">
        <b-input v-model="data.model"></b-input>
      </b-form-group>
      <b-form-group v-if="data.hasLabel" :label="$t('fm.config.widget.label')">
        <b-input v-model="data.label"></b-input>
      </b-form-group>
      <b-form-group v-if="Object.keys(data.options).indexOf('width') >= 0" :label="$t('fm.config.widget.width')">
        <b-input v-model="data.options.width"></b-input>
      </b-form-group>
      <b-form-group v-if="Object.keys(data.options).indexOf('height') >= 0" :label="$t('fm.config.widget.height')">
        <b-input v-model="data.options.height"></b-input>
      </b-form-group>
      <b-form-group v-if="Object.keys(data.options).indexOf('size') >= 0" :label="$t('fm.config.widget.size')">
        {{ $t('fm.config.widget.width') }}
        <b-input style="width: 90px" type="number" v-model.number="data.options.size.width"></b-input>
        {{ $t('fm.config.widget.height') }}
        <b-input style="width: 90px" type="number" v-model.number="data.options.size.height"></b-input>
      </b-form-group>
      <b-form-group v-if="Object.keys(data.options).indexOf('placeholder') >= 0 && (data.type !== 'time' || data.type !== 'date')" :label="$t('fm.config.widget.placeholder')">
        <b-input v-model="data.options.placeholder"></b-input>
      </b-form-group>
      <b-form-group v-if="Object.keys(data.options).indexOf('inline') >= 0" :label="$t('fm.config.widget.layout')">
        <b-radio-group v-model="data.options.inline">
          <b-radio :label="false">{{ $t('fm.config.widget.block') }}</b-radio>
          <b-radio :label="true">{{ $t('fm.config.widget.inline') }}</b-radio>
        </b-radio-group>
      </b-form-group>
      <b-form-group v-if="Object.keys(data.options).indexOf('showInput') >= 0" :label="$t('fm.config.widget.showInput')">
        <b-checkbox switch v-model="data.options.showInput"></b-checkbox>
      </b-form-group>
      <b-form-group v-if="Object.keys(data.options).indexOf('min') >= 0" :label="$t('fm.config.widget.min')">
        <b-input type="number" v-model="data.options.min" :min="0" :max="100" :step="1"></b-input>
      </b-form-group>
      <b-form-group v-if="Object.keys(data.options).indexOf('max') >= 0" :label="$t('fm.config.widget.max')">
        <b-input type="number" v-model="data.options.max" :min="0" :max="100" :step="1"></b-input>
      </b-form-group>
      <b-form-group v-if="Object.keys(data.options).indexOf('step') >= 0" :label="$t('fm.config.widget.step')">
        <b-input type="number" v-model="data.options.step" :min="0" :max="100" :step="1"></b-input>
      </b-form-group>
      <b-form-group v-if="data.type === 'select' || data.type === 'imgupload'" :label="$t('fm.config.widget.multiple')">
        <b-checkbox switch v-model="data.options.multiple" @change="handleSelectMuliple"></b-checkbox>
      </b-form-group>
      <b-form-group v-if="data.type === 'select'" :label="$t('fm.config.widget.filterable')">
        <b-checkbox switch v-model="data.options.filterable"></b-checkbox>
      </b-form-group>
      <b-form-group v-if="Object.keys(data.options).indexOf('allowHalf') >= 0" :label="$t('fm.config.widget.allowHalf')">
        <b-checkbox switch v-model="data.options.allowHalf"></b-checkbox>
      </b-form-group>
      <b-form-group v-if="Object.keys(data.options).indexOf('showAlpha') >= 0" :label="$t('fm.config.widget.showAlpha')">
        <b-checkbox switch v-model="data.options.showAlpha"></b-checkbox>
      </b-form-group>
      <b-form-group v-if="Object.keys(data.options).indexOf('showLabel') >= 0" :label="$t('fm.config.widget.showLabel')">
        <b-checkbox switch v-model="data.options.showLabel"></b-checkbox>
      </b-form-group>
      <b-form-group v-if="Object.keys(data.options).indexOf('options') >= 0" :label="$t('fm.config.widget.option')">
        <b-radio-group v-model="data.options.remote" size="sm" style="margin-bottom: 10px">
          <b-radio :value="false">{{ $t('fm.config.widget.staticData') }}</b-radio>
          <b-radio :value="true">{{ $t('fm.config.widget.remoteData') }}</b-radio>
        </b-radio-group>
        <template v-if="data.options.remote">
          <div>
            <b-input-group size="sm" :prepend="$t('fm.config.widget.remoteFunc')" class="mb-1">
              <!-- <template #prepend>{{}}</template> -->
              <b-input></b-input>
            </b-input-group>
            <b-input-group size="sm" :prepend="$t('fm.config.widget.value')" class="mb-1">
              <b-input v-model="data.options.props.value"></b-input>
            </b-input-group>
            <b-input-group size="sm" :prepend="$t('fm.config.widget.label')">
              <b-input v-model="data.options.props.label"></b-input>
            </b-input-group>
          </div>
        </template>
        <template v-else>
          <template v-if="data.type === 'radio' || (data.type === 'select' && !data.options.multiple)">
            <b-radio-group v-model="data.options.defaultValue">
              <draggable tag="ul" :list="data.options.options" v-bind="{ group: { name: 'options' }, ghostClass: 'ghost', handle: '.drag-item' }" handle=".drag-item">
                <li v-for="(item, index) in data.options.options" :key="index" class="mb-1 d-flex align-items-center">
                  <b-radio :label="item.value" class="mr-1">
                    <b-input :style="{ width: data.options.showLabel ? '90px' : '180px' }" size="sm" v-model="item.value"></b-input>
                    <b-input style="width: 90px" size="sm" v-if="data.options.showLabel" v-model="item.label"></b-input>
                    <!-- <input v-model="item.value"/> -->
                  </b-radio>
                  <i class="drag-item" style="font-size: 16px; margin: 0 5px; cursor: move">
                    <i class="ri-menu-line"></i>
                  </i>
                  <b-button @click="handleOptionsRemove(index)" pill variant="outline-danger" size="sm" class="ml-1 p-1">
                    <i class="ri-subtract-line"></i>
                  </b-button>
                </li>
              </draggable>
            </b-radio-group>
          </template>

          <template v-if="data.type === 'checkbox' || (data.type === 'select' && data.options.multiple)">
            <b-checkbox-group v-model="data.options.defaultValue">
              <draggable tag="ul" :list="data.options.options" v-bind="{ group: { name: 'options' }, ghostClass: 'ghost', handle: '.drag-item' }" handle=".drag-item">
                <li v-for="(item, index) in data.options.options" :key="index" class="mb-1">
                  <b-checkbox :label="item.value" style="margin-right: 5px">
                    <b-input :style="{ width: data.options.showLabel ? '90px' : '180px' }" size="sm" v-model="item.value"></b-input>
                    <b-input style="width: 90px" size="sm" v-if="data.options.showLabel" v-model="item.label"></b-input>
                  </b-checkbox>
                  <i class="drag-item" style="font-size: 16px; margin: 0 5px; cursor: move">
                    <i class="ri-menu-line"></i>
                  </i>
                  <b-button @click="handleOptionsRemove(index)" pill variant="outline-danger" size="sm" class="ml-1 p-1">
                    <i class="ri-subtract-line"></i>
                  </b-button>
                </li>
              </draggable>
            </b-checkbox-group>
          </template>
          <div style="margin-left: 22px">
            <b-button variant="outline-primary" @click="handleAddOption">{{ $t('fm.actions.addOption') }}</b-button>
          </div>
        </template>
      </b-form-group>

      <b-form-group v-if="data.type === 'cascader'" :label="$t('fm.config.widget.remoteData')">
        <b-input-group size="sm" :prepend="$t('fm.config.widget.remoteFunc')" class="mb-1">
          <b-input></b-input>
        </b-input-group>
        <b-input-group size="sm" :prepend="$t('fm.config.widget.value')" class="mb-1">
          <b-input v-model="data.options.props.value"></b-input>
        </b-input-group>
        <b-input-group size="sm" :prepend="$t('fm.config.widget.label')" class="mb-1">
          <b-input v-model="data.options.props.label"></b-input>
        </b-input-group>
        <b-input-group size="sm" :prepend="$t('fm.config.widget.childrenOption')" class="mb-1">
          <b-input v-model="data.options.props.children"></b-input>
        </b-input-group>
      </b-form-group>

      <template v-if="data.type === 'view-list'">
        <b-form-group horizontal label-cols="10" label-class="pt-0 pb-0" :label="$t('fm.config.widget.hover')">
          <b-checkbox switch v-model="data.options.hover"></b-checkbox>
        </b-form-group>
        <b-form-group horizontal label-cols="10" label-class="pt-0 pb-0" :label="$t('fm.config.widget.striped')">
          <b-checkbox switch v-model="data.options.striped"></b-checkbox>
        </b-form-group>
        <b-form-group horizontal label-cols="10" label-class="pt-0 pb-0" :label="$t('fm.config.widget.selectable')">
          <b-checkbox switch v-model="data.options.selectable"></b-checkbox>
        </b-form-group>
        <b-form-group v-if="data.options.selectable" :label="$t('fm.config.widget.selectMode')">
          <b-select v-model="data.options.selectMode">
            <b-select-option value="single">Jeden wiersz</b-select-option>
            <b-select-option value="multi">Kilka wierszy</b-select-option>
          </b-select>
        </b-form-group>
        <b-form-group :label="$t('fm.config.widget.fields')">
          <draggable tag="ul" :list="data.options.fields" v-bind="{ group: { name: 'fields' }, ghostClass: 'ghost', handle: '.drag-item' }" handle=".drag-item">
            <li v-for="(item, index) in data.options.fields" :key="index" class="mb-1 d-flex align-items-center">
              <b-input style="width: 90px" size="sm" v-model="item.key"></b-input>
              <b-input style="ml-1" size="sm" v-model="item.label"></b-input>
              <b-checkbox v-model="item.sortable" class="ml-1"></b-checkbox>
              <i class="drag-item" style="font-size: 16px; margin: 0 5px; cursor: move">
                <i class="ri-menu-line"></i>
              </i>
              <b-button @click="handleFieldsRemove(index)" pill variant="outline-danger" size="sm" class="ml-1 p-1">
                <i class="ri-subtract-line"></i>
              </b-button>
            </li>
          </draggable>
          <div>
            <b-button variant="outline-primary" @click="handleAddField">{{ $t('fm.actions.addColumn') }}</b-button>
          </div>
        </b-form-group>
        <b-form-group horizontal class="mt-1" :label="$t('fm.config.widget.sortBy')">
          <b-form-input size="sm" v-model="data.options.sort.sortBy"></b-form-input>
        </b-form-group>
        <b-form-group horizontal class="mt-1" :label="$t('fm.config.widget.customClass')">
          <b-form-input size="sm" v-model="data.options.customClass"></b-form-input>
        </b-form-group>
        <b-form-group horizontal class="mt-1" :label="$t('fm.config.widget.bodyClass')">
          <b-form-input size="sm" v-model="data.options.bodyClass"></b-form-input>
        </b-form-group>
      </template>

      <template v-if="data.type === 'pagination'">
        <b-form-group :label="$t('fm.config.widget.align')">
          <b-select v-model="data.options.align">
            <b-select-option value="left">Z lewej</b-select-option>
            <b-select-option value="center">Pośrodku</b-select-option>
            <b-select-option value="right">Z prawej</b-select-option>
            <b-select-option value="fill">Na całą stronę</b-select-option>
          </b-select>
        </b-form-group>
        <b-form-group horizontal :label="$t('fm.config.widget.customClass')">
          <b-form-input size="sm" v-model="data.options.customClass"></b-form-input>
        </b-form-group>
      </template>

      <b-form-group
        :label="$t('fm.config.widget.defaultValue')"
        v-if="
          Object.keys(data.options).indexOf('defaultValue') >= 0 &&
          (data.type === 'textarea' || data.type === 'input' || data.type === 'rate' || data.type === 'color' || data.type === 'switch' || data.type === 'text')
        "
      >
        <b-textarea v-if="data.type === 'textarea'" :rows="5" v-model="data.options.defaultValue"></b-textarea>
        <b-input v-if="data.type === 'input'" v-model="data.options.defaultValue"></b-input>
        <b-rating v-if="data.type === 'rate'" inline style="display: inline-block; vertical-align: middle" :max="data.options.max" v-model="data.options.defaultValue"></b-rating>
        <b-button v-if="data.type === 'rate'" style="display: inline-block; vertical-align: middle; margin-left: 10px" @click="data.options.defaultValue = 0">
          {{ $t('fm.actions.clear') }}
        </b-button>
        <b-input v-if="data.type === 'color'" type="color" v-model="data.options.defaultValue"></b-input>
        <b-checkbox v-if="data.type === 'switch'" switch v-model="data.options.defaultValue"></b-checkbox>
        <b-input v-if="data.type === 'text'" v-model="data.options.defaultValue"></b-input>
      </b-form-group>

      <b-form-group :label="$t('fm.config.widget.maxlength')" v-if="data.type === 'textarea' || data.type === 'input'">
        <b-input type="number" v-model="data.options.maxlength" :min="-1"></b-input>
      </b-form-group>

      <b-form-group :label="$t('fm.config.widget.showWordLimit')" v-if="data.type === 'textarea' || data.type === 'input'">
        <b-checkbox switch v-model="data.options.showWordLimit"></b-checkbox>
      </b-form-group>

      <template v-if="data.type === 'time' || data.type === 'date'">
        <b-form-group :label="$t('fm.config.widget.showType')" v-if="data.type === 'date'">
          <b-select v-model="data.options.type">
            <b-select-option value="year">Year</b-select-option>
            <b-select-option value="month">Month</b-select-option>
            <b-select-option value="date">Date</b-select-option>
            <b-select-option value="dates">Dates</b-select-option>
            <b-select-option value="week">Week</b-select-option>
            <b-select-option value="datetime">Datetime</b-select-option>
            <b-select-option value="datetimerange">Datetimerange</b-select-option>
            <b-select-option value="daterange">Daterange</b-select-option>
          </b-select>
        </b-form-group>
        <b-form-group :label="$t('fm.config.widget.isRange')" v-if="data.type === 'time'">
          <b-checkbox switch v-model="data.options.isRange"></b-checkbox>
        </b-form-group>
        <b-form-group :label="$t('fm.config.widget.isTimestamp')" v-if="data.type === 'date'">
          <b-checkbox switch v-model="data.options.timestamp"></b-checkbox>
        </b-form-group>
        <b-form-group
          :label="$t('fm.config.widget.placeholder')"
          v-if="(!data.options.isRange && data.type === 'time') || (data.type !== 'time' && data.options.type !== 'datetimerange' && data.options.type !== 'daterange')"
        >
          <b-input v-model="data.options.placeholder"></b-input>
        </b-form-group>
        <b-form-group :label="$t('fm.config.widget.startPlaceholder')" v-if="data.options.isRange || data.options.type === 'datetimerange' || data.options.type === 'daterange'">
          <b-input v-model="data.options.startPlaceholder"></b-input>
        </b-form-group>
        <b-form-group :label="$t('fm.config.widget.endPlaceholder')" v-if="data.options.isRange || data.options.type === 'datetimerange' || data.options.type === 'daterange'">
          <b-input v-model="data.options.endPlaceholder"></b-input>
        </b-form-group>
        <b-form-group :label="$t('fm.config.widget.format')">
          <b-input v-model="data.options.format"></b-input>
        </b-form-group>
        <b-form-group :label="$t('fm.config.widget.defaultValue')" v-if="data.type === 'time' && Object.keys(data.options).indexOf('isRange') >= 0">
          <b-timepicker
            key="1"
            style="width: 100%"
            v-if="!data.options.isRange"
            v-model="data.options.defaultValue"
            :arrowControl="data.options.arrowControl"
            :value-format="data.options.format"
          >
          </b-timepicker>
          <b-timepicker
            key="2"
            v-if="data.options.isRange"
            style="width: 100%"
            v-model="data.options.defaultValue"
            is-range
            :arrowControl="data.options.arrowControl"
            :value-format="data.options.format"
          >
          </b-timepicker>
        </b-form-group>
      </template>

      <template v-if="data.type === 'imgupload'">
        <b-form-group :label="$t('fm.config.widget.uploadLimit')">
          <b-input type="number" v-model.number="data.options.length"></b-input>
        </b-form-group>
        <b-form-group :label="$t('fm.config.widget.isQiniu')">
          <b-checkbox switch v-model="data.options.isQiniu"></b-checkbox>
        </b-form-group>
        <template v-if="data.options.isQiniu">
          <b-form-group label="Domain" :required="true">
            <b-input v-model="data.options.domain"></b-input>
          </b-form-group>
          <b-form-group :label="$t('fm.config.widget.tokenFunc')" :required="true">
            <b-input v-model="data.options.tokenFunc"></b-input>
          </b-form-group>
        </template>
        <template v-else>
          <b-form-group :label="$t('fm.config.widget.imageAction')" :required="true">
            <b-input v-model="data.options.action"></b-input>
          </b-form-group>
        </template>
      </template>

      <template v-if="data.type === 'blank'">
        <b-form-group :label="$t('fm.config.widget.defaultType')">
          <b-select v-model="data.options.defaultType">
            <b-select-option value="String">{{ $t('fm.config.widget.string') }}</b-select-option>
            <b-select-option value="Object">{{ $t('fm.config.widget.object') }}</b-select-option>
            <b-select-option value="Array">{{ $t('fm.config.widget.array') }}</b-select-option>
          </b-select>
        </b-form-group>
      </template>

      <template v-if="data.type === 'grid'">
        <b-form-group horizontal :label-cols="10" :label="$t('fm.config.widget.noGutter')">
          <b-checkbox switch v-model="data.options.noGutter"></b-checkbox>
        </b-form-group>
        <b-form-group :label="$t('fm.config.widget.columnOption')">
          <draggable tag="ul" :list="data.columns" v-bind="{ group: { name: 'options' }, ghostClass: 'ghost', handle: '.drag-item' }" handle=".drag-item">
            <li v-for="(item, index) in data.columns" :key="index">
              <div class="d-flex align-items-center">
                <i class="drag-item float-left" style="font-size: 16px; margin: 0 5px; cursor: move">
                  <i class="ri-menu-line"></i>
                </i>
                <b-input :placeholder="$t('fm.config.widget.cols')" size="sm" type="number" class="float-left" v-model.number="item.cols"></b-input>
                <b-input :placeholder="$t('fm.config.widget.offset')" size="sm" type="number" v-model.number="item.offset"></b-input>
                <b-input :placeholder="$t('fm.config.widget.order')" size="sm" type="number" v-model.number="item.order"></b-input>
                <a v-b-toggle="`collapse-col-${index}`" class="btn btn-sm action-icon ri-arrow-down-s-line a-collapse-nested" name="a-collapse-nested" size="sm" switch></a>
                <b-button @click="handleOptionsRemove(index)" pill plain variant="outline-danger" size="sm" class="m-1 p-1">
                  <i class="ri-subtract-line"></i>
                </b-button>
              </div>

              <b-collapse :id="`collapse-col-${index}`" class="mb-2">
                <b-row v-for="size in gridSizes" :key="size.val" class="d-flex" align-content="end">
                  <b-col cols="1" offset="1">
                    <span>{{ $t(`fm.config.widget.${size.val}`) }}</span>
                  </b-col>
                  <b-col class="d-flex">
                    <b-input :placeholder="$t('fm.config.widget.cols')" size="sm" type="number" v-model.number="item[size.val]"></b-input>
                    <b-input :placeholder="$t('fm.config.widget.offset')" size="sm" type="number" v-model.number="item[`offset${[size.val]}`]"></b-input>
                    <b-input :placeholder="$t('fm.config.widget.order')" size="sm" type="number" v-model.number="item[`order${[size.val]}`]"></b-input>
                  </b-col>
                  <b-col cols="2" class="mr-2">
                    <span>&#8925;{{ size.label }}</span>
                  </b-col>
                </b-row>
                <b-row class="mt-2">
                  <b-col offset="1">
                    <b-form-group :label="$t('fm.config.widget.alignSelf')">
                      <b-select v-model="item.alignSelf" size="sm">
                        <b-select-option :value="null">{{ $tc('common.notSelected') }}</b-select-option>
                        <b-select-option value="start">{{ $t('fm.config.widget.alignStart') }}</b-select-option>
                        <b-select-option value="center">{{ $t('fm.config.widget.alignCenter') }}</b-select-option>
                        <b-select-option value="end">{{ $t('fm.config.widget.alignEnd') }}</b-select-option>
                        <b-select-option value="baseline">{{ $t('fm.config.widget.alignBaseline') }}</b-select-option>
                        <b-select-option value="stretch">{{ $t('fm.config.widget.alignStretch') }}</b-select-option>
                      </b-select>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col offset="1">
                    <b-form-group :label="$t('fm.config.widget.tag')">
                      <b-form-input v-model="item.tag" size="sm" type="text"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col offset="1">
                    <b-form-group horizontal class="mt-1" :label="$t('fm.config.widget.customClass')">
                      <b-form-input size="sm" v-model="item.customClass"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-collapse>
            </li>
          </draggable>
          <div style="margin-left: 22px">
            <b-button variant="outline-primary" @click="handleAddColumn">{{ $t('fm.actions.addColumn') }}</b-button>
          </div>
        </b-form-group>
        <b-form-group horizontal class="mt-1" label-cols="8" :label="$t('fm.config.widget.rowCols')">
          <b-input v-model.number="data.options.cols" size="sm" type="number"></b-input>
        </b-form-group>
        <b-form-group horizontal class="mt-1" label-cols="8" :label="$t('fm.config.widget.rowColsSm')">
          <b-input v-model.number="data.options.colsSm" size="sm" type="number"></b-input>
        </b-form-group>
        <b-form-group horizontal class="mt-1" label-cols="8" :label="$t('fm.config.widget.rowColsLg')">
          <b-input v-model.number="data.options.colsMd" size="sm" type="number"></b-input>
        </b-form-group>
        <b-form-group horizontal class="mt-1" label-cols="8" :label="$t('fm.config.widget.rowColsLg')">
          <b-input v-model.number="data.options.colsLg" size="sm" type="number"></b-input>
        </b-form-group>
        <b-form-group horizontal class="mt-1" label-cols="8" :label="$t('fm.config.widget.rowColsXl')">
          <b-input v-model.number="data.options.colsXl" size="sm" type="number"></b-input>
        </b-form-group>
        <b-form-group horizontal :label="$t('fm.config.widget.alignContent')">
          <b-select v-model="data.options.alignContent" size="sm">
            <b-select-option :value="null">{{ $tc('common.notSelected') }}</b-select-option>
            <b-select-option value="start">{{ $t('fm.config.widget.alignStart') }}</b-select-option>
            <b-select-option value="center">{{ $t('fm.config.widget.alignCenter') }}</b-select-option>
            <b-select-option value="end">{{ $t('fm.config.widget.alignEnd') }}</b-select-option>
            <b-select-option value="around">{{ $t('fm.config.widget.alignAround') }}</b-select-option>
            <b-select-option value="stretch">{{ $t('fm.config.widget.alignStretch') }}</b-select-option>
          </b-select>
        </b-form-group>
        <b-form-group horizontal :label="$t('fm.config.widget.alignH')">
          <b-select v-model="data.options.alignH" size="sm">
            <b-select-option :value="null">{{ $tc('common.notSelected') }}</b-select-option>
            <b-select-option value="start">{{ $t('fm.config.widget.alignStart') }}</b-select-option>
            <b-select-option value="center">{{ $t('fm.config.widget.alignCenter') }}</b-select-option>
            <b-select-option value="end">{{ $t('fm.config.widget.alignEnd') }}</b-select-option>
            <b-select-option value="around">{{ $t('fm.config.widget.alignAround') }}</b-select-option>
            <b-select-option value="between">{{ $t('fm.config.widget.alignBetween') }}</b-select-option>
          </b-select>
        </b-form-group>
        <b-form-group horizontal :label="$t('fm.config.widget.alignV')">
          <b-select v-model="data.options.alignV" size="sm">
            <b-select-option :value="null">{{ $tc('common.notSelected') }}</b-select-option>
            <b-select-option value="start">{{ $t('fm.config.widget.alignStart') }}</b-select-option>
            <b-select-option value="center">{{ $t('fm.config.widget.alignCenter') }}</b-select-option>
            <b-select-option value="end">{{ $t('fm.config.widget.alignEnd') }}</b-select-option>
            <b-select-option value="baseline">{{ $t('fm.config.widget.alignBaseline') }}</b-select-option>
            <b-select-option value="stretch">{{ $t('fm.config.widget.alignStretch') }}</b-select-option>
          </b-select>
        </b-form-group>
        <b-form-group horizontal class="mt-1" :label="$t('fm.config.widget.customClass')">
          <b-form-input size="sm" v-model="data.options.customClass"></b-form-input>
        </b-form-group>
      </template>

      <template v-if="data.type === 'container'">
        <b-form-group :label="$t('fm.config.widget.fluid')">
          <b-select v-model="data.options.fluid">
            <b-select-option :value="null">{{ $tc('common.notSelected') }}</b-select-option>
            <b-select-option :value="true">100%</b-select-option>
            <b-select-option value="sm">SM</b-select-option>
            <b-select-option value="md">MD</b-select-option>
            <b-select-option value="lg">LG</b-select-option>
            <b-select-option value="xl">XL</b-select-option>>
          </b-select>
        </b-form-group>
        <b-form-group horizontal class="mt-1" :label="$t('fm.config.widget.customClass')">
          <b-form-input size="sm" v-model="data.options.customClass"></b-form-input>
        </b-form-group>
      </template>

      <template v-if="data.type === 'card'">
        <b-form-group horizontal class="mt-1" :label="$t('fm.config.widget.title')">
          <b-form-input size="sm" v-model="data.options.title"></b-form-input>
        </b-form-group>
        <b-form-group horizontal class="mt-1" :label="$t('fm.config.widget.subTitle')">
          <b-form-input size="sm" v-model="data.options.subTitle"></b-form-input>
        </b-form-group>
        <b-form-group horizontal class="mt-1" :label="$t('fm.config.widget.customClass')">
          <b-form-input size="sm" v-model="data.options.customClass"></b-form-input>
        </b-form-group>
      </template>

      <template v-if="data.type === 'toolbar'">
        <b-form-group horizontal :label-cols="10" :label="$t('fm.config.widget.keyNav')">
          <b-checkbox switch v-model="data.options.keyNav"></b-checkbox>
        </b-form-group>
        <b-form-group horizontal class="mt-1" :label="$t('fm.config.widget.customClass')">
          <b-form-input size="sm" v-model="data.options.customClass"></b-form-input>
        </b-form-group>
      </template>

      <template v-if="data.type === 'btnGroup'">
        <b-form-group horizontal class="mt-1" :label="$t('fm.config.widget.vertical')">
          <b-checkbox switch v-model="data.options.vertical"></b-checkbox>
        </b-form-group>
        <b-form-group horizontal class="mt-1" :label="$t('fm.config.widget.customClass')">
          <b-form-input size="sm" v-model="data.options.customClass"></b-form-input>
        </b-form-group>
      </template>

      <template v-if="data.type === 'collapse'">
        <b-form-group horizontal class="mt-1" label-cols="7" :label="$t('fm.config.widget.visible')">
          <b-checkbox switch v-model="data.options.defaultValue" class="mt-1"></b-checkbox>
        </b-form-group>
        <b-form-group horizontal class="mt-1" label-cols="7" :label="$t('fm.config.widget.appear')">
          <b-checkbox switch v-model="data.options.appear" class="mt-1"></b-checkbox>
        </b-form-group>
        <b-form-group horizontal class="mt-1" :label="$t('fm.config.widget.accordion')">
          <b-form-input size="sm" v-model="data.options.accordion"></b-form-input>
        </b-form-group>
        <b-form-group horizontal class="mt-1" :label="$t('fm.config.widget.customClass')">
          <b-form-input size="sm" v-model="data.options.customClass"></b-form-input>
        </b-form-group>
      </template>

      <template v-if="data.type === 'dropdown'">
        <b-form-group horizontal class="mt-1" :label="$t('fm.config.widget.text')">
          <b-form-input size="sm" v-model="data.options.text"></b-form-input>
        </b-form-group>
        <b-form-group :label="$t('fm.config.widget.itemsOption')">
          <draggable tag="ul" :list="data.items" v-bind="{ group: { name: 'options' }, ghostClass: 'ghost', handle: '.drag-item' }" handle=".drag-item">
            <li v-for="(item, index) in data.items" :key="index">
              <div class="d-flex align-items-center">
                <i class="drag-item float-left" style="font-size: 16px; margin: 0 5px; cursor: move">
                  <i class="ri-menu-line"></i>
                </i>
                <b-input :placeholder="$t('fm.config.widget.text')" size="sm" type="text" class="float-left" v-model="item.text"></b-input>
                <b-button @click="handleOptionsRemove(index)" pill plain variant="outline-danger" size="sm" class="m-1 p-1">
                  <i class="ri-subtract-line"></i>
                </b-button>
              </div>
            </li>
          </draggable>
          <div style="margin-left: 22px">
            <b-button variant="outline-primary" @click="handleAddItem">{{ $t('fm.actions.addItem') }}</b-button>
          </div>
        </b-form-group>
        <b-form-group horizontal :label-cols="10" :label="$t('fm.config.widget.block')">
          <b-checkbox switch v-model="data.options.block"></b-checkbox>
        </b-form-group>
        <b-form-group horizontal :label-cols="10" :label="$t('fm.config.widget.dropleft')">
          <b-checkbox switch v-model="data.options.dropleft"></b-checkbox>
        </b-form-group>
        <b-form-group horizontal :label-cols="10" :label="$t('fm.config.widget.dropright')">
          <b-checkbox switch v-model="data.options.dropright"></b-checkbox>
        </b-form-group>
        <b-form-group horizontal :label-cols="10" :label="$t('fm.config.widget.dropup')">
          <b-checkbox switch v-model="data.options.dropup"></b-checkbox>
        </b-form-group>
        <b-form-group horizontal :label-cols="10" :label="$t('fm.config.widget.noCaret')">
          <b-checkbox switch v-model="data.options.noCaret"></b-checkbox>
        </b-form-group>
        <b-form-group horizontal :label-cols="10" :label="$t('fm.config.widget.noFlip')">
          <b-checkbox switch v-model="data.options.noFlip"></b-checkbox>
        </b-form-group>
        <b-form-group horizontal :label-cols="6" :label="$t('fm.config.widget.offset')">
          <b-form-input size="sm" v-model="data.options.offset"></b-form-input>
        </b-form-group>
        <b-form-group horizontal :label-cols="10" :label="$t('fm.config.widget.right')">
          <b-checkbox switch v-model="data.options.right"></b-checkbox>
        </b-form-group>
        <b-form-group horizontal :label-cols="10" :label="$t('fm.config.widget.split')">
          <b-checkbox switch v-model="data.options.split"></b-checkbox>
        </b-form-group>
        <b-form-group :label="$t('fm.config.widget.variant')">
          <b-select v-model="data.options.variant" size="sm">
            <b-select-option value="primary" :label="$t('fm.config.widget.variants.primary')"></b-select-option>
            <b-select-option value="secondary" :label="$t('fm.config.widget.variants.secondary')"></b-select-option>
            <b-select-option value="success" :label="$t('fm.config.widget.variants.success')"></b-select-option>
            <b-select-option value="danger" :label="$t('fm.config.widget.variants.danger')"></b-select-option>
            <b-select-option value="warning" :label="$t('fm.config.widget.variants.warning')"></b-select-option>
            <b-select-option value="info" :label="$t('fm.config.widget.variants.info')"></b-select-option>
            <b-select-option value="light" :label="$t('fm.config.widget.variants.light')"></b-select-option>
            <b-select-option value="dark" :label="$t('fm.config.widget.variants.dark')"></b-select-option>

            <b-select-option value="outline-primary" :label="$t('fm.config.widget.variants.outlinePrimary')"></b-select-option>
            <b-select-option value="outline-secondary" :label="$t('fm.config.widget.variants.outlineSecondary')"></b-select-option>
            <b-select-option value="outline-success" :label="$t('fm.config.widget.variants.outlineSuccess')"></b-select-option>
            <b-select-option value="outline-danger" :label="$t('fm.config.widget.variants.outlineDanger')"></b-select-option>
            <b-select-option value="outline-warning" :label="$t('fm.config.widget.variants.outlineWarning')"></b-select-option>
            <b-select-option value="outline-info" :label="$t('fm.config.widget.variants.outlineInfo')"></b-select-option>
            <b-select-option value="outline-light" :label="$t('fm.config.widget.variants.outlineLight')"></b-select-option>
            <b-select-option value="outline-dark" :label="$t('fm.config.widget.variants.outlineDark')"></b-select-option>
          </b-select>
        </b-form-group>
        <b-form-group horizontal class="mt-1" :label="$t('fm.config.widget.customClass')">
          <b-form-input size="sm" v-model="data.options.customClass"></b-form-input>
        </b-form-group>
      </template>

      <template v-if="data.type === 'button'">
        <b-form-group horizontal class="mt-1" :label="$t('fm.config.widget.title')">
          <b-form-input size="sm" v-model="data.options.title"></b-form-input>
        </b-form-group>
        <b-form-group :label="$t('fm.config.widget.variant')">
          <b-select v-model="data.options.variant" size="sm">
            <b-select-option value="primary" :label="$t('fm.config.widget.variants.primary')"></b-select-option>
            <b-select-option value="secondary" :label="$t('fm.config.widget.variants.secondary')"></b-select-option>
            <b-select-option value="success" :label="$t('fm.config.widget.variants.success')"></b-select-option>
            <b-select-option value="danger" :label="$t('fm.config.widget.variants.danger')"></b-select-option>
            <b-select-option value="warning" :label="$t('fm.config.widget.variants.warning')"></b-select-option>
            <b-select-option value="info" :label="$t('fm.config.widget.variants.info')"></b-select-option>
            <b-select-option value="light" :label="$t('fm.config.widget.variants.light')"></b-select-option>
            <b-select-option value="dark" :label="$t('fm.config.widget.variants.dark')"></b-select-option>

            <b-select-option value="outline-primary" :label="$t('fm.config.widget.variants.outlinePrimary')"></b-select-option>
            <b-select-option value="outline-secondary" :label="$t('fm.config.widget.variants.outlineSecondary')"></b-select-option>
            <b-select-option value="outline-success" :label="$t('fm.config.widget.variants.outlineSuccess')"></b-select-option>
            <b-select-option value="outline-danger" :label="$t('fm.config.widget.variants.outlineDanger')"></b-select-option>
            <b-select-option value="outline-warning" :label="$t('fm.config.widget.variants.outlineWarning')"></b-select-option>
            <b-select-option value="outline-info" :label="$t('fm.config.widget.variants.outlineInfo')"></b-select-option>
            <b-select-option value="outline-light" :label="$t('fm.config.widget.variants.outlineLight')"></b-select-option>
            <b-select-option value="outline-dark" :label="$t('fm.config.widget.variants.outlineDark')"></b-select-option>
          </b-select>
        </b-form-group>
        <b-form-group horizontal :label-cols="10" :label="$t('fm.config.widget.pill')">
          <b-checkbox switch v-model="data.options.pill"></b-checkbox>
        </b-form-group>
        <b-form-group horizontal :label-cols="10" :label="$t('fm.config.widget.squared')">
          <b-checkbox switch v-model="data.options.squared"></b-checkbox>
        </b-form-group>
        <b-form-group horizontal :label-cols="10" :label="$t('fm.config.widget.block')">
          <b-checkbox switch v-model="data.options.block"></b-checkbox>
        </b-form-group>
        <b-form-group horizontal class="mt-1" :label="$t('fm.config.widget.customClass')">
          <b-form-input size="sm" v-model="data.options.customClass"></b-form-input>
        </b-form-group>
      </template>

      <template v-if="data.type !== 'grid'">
        <b-form-group :label="$t('fm.config.widget.attribute')">
          <b-checkbox v-model="data.options.readonly" v-if="Object.keys(data.options).indexOf('readonly') >= 0">{{ $t('fm.config.widget.readonly') }}</b-checkbox>
          <b-checkbox v-model="data.options.disabled" v-if="Object.keys(data.options).indexOf('disabled') >= 0">{{ $t('fm.config.widget.disabled') }} </b-checkbox>
          <b-checkbox v-model="data.options.editable" v-if="Object.keys(data.options).indexOf('editable') >= 0">{{ $t('fm.config.widget.editable') }}</b-checkbox>
          <b-checkbox v-model="data.options.clearable" v-if="Object.keys(data.options).indexOf('clearable') >= 0">{{ $t('fm.config.widget.clearable') }} </b-checkbox>
          <b-checkbox v-model="data.options.arrowControl" v-if="Object.keys(data.options).indexOf('arrowControl') >= 0">{{ $t('fm.config.widget.arrowControl') }}</b-checkbox>
          <b-checkbox v-model="data.options.isDelete" v-if="Object.keys(data.options).indexOf('isDelete') >= 0">{{ $t('fm.config.widget.isDelete') }}</b-checkbox>
          <b-checkbox v-model="data.options.isEdit" v-if="Object.keys(data.options).indexOf('isEdit') >= 0">{{ $t('fm.config.widget.isEdit') }}</b-checkbox>
        </b-form-group>

        <b-form-group :label="$t('fm.config.widget.validate')">
          <div v-if="Object.keys(data.options).indexOf('required') >= 0" class="mb-2">
            <b-checkbox v-model="data.options.required">{{ $t('fm.config.widget.required') }}</b-checkbox>
          </div>
          <b-select v-if="Object.keys(data.options).indexOf('dataType') >= 0" v-model="data.options.dataType" size="sm">
            <b-select-option value="text" :label="$t('fm.config.widget.string')"></b-select-option>
            <b-select-option value="number" :label="$t('fm.config.widget.number')"></b-select-option>
            <b-select-option value="search" :label="$t('fm.config.widget.search')"></b-select-option>
            <b-select-option value="tel" :label="$t('fm.config.widget.tel')"></b-select-option>
            <b-select-option value="date" :label="$t('fm.config.widget.date')"></b-select-option>
            <b-select-option value="time" :label="$t('fm.config.widget.time')"></b-select-option>
            <b-select-option value="range" :label="$t('fm.config.widget.range')"></b-select-option>
            <b-select-option value="color" :label="$t('fm.config.widget.color')"></b-select-option>
            <b-select-option value="url" :label="$t('fm.config.widget.url')"></b-select-option>
            <b-select-option value="email" :label="$t('fm.config.widget.email')"></b-select-option>
            <b-select-option value="password" :label="$t('fm.config.widget.password')"></b-select-option>
          </b-select>

          <!-- <div v-if="Object.keys(data.options).indexOf('pattern') >= 0">
            <b-input size="sm" class="config-pattern-input" v-model.lazy="data.options.pattern" style="width: 240px" :placeholder="$t('fm.config.widget.patternPlaceholder')">
              <template slot="prepend">/</template>
              <template slot="append">/</template>
            </b-input>
          </div> -->
        </b-form-group>
      </template>
    </b-form>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  components: {
    Draggable,
  },
  props: ['data'],
  data() {
    return {
      validator: {
        type: null,
        required: null,
        pattern: null,
        range: null,
        length: null,
      },
      gridSizes: [
        { val: 'sm', label: '576px' },
        { val: 'md', label: '768px' },
        { val: 'lg', label: '992px' },
        { val: 'xl', label: '1200px' },
      ],
    }
  },
  computed: {
    show() {
      if (this.data && Object.keys(this.data).length > 0) {
        return true
      }
      return false
    },
  },
  methods: {
    handleOptionsRemove(index) {
      if (this.data.type === 'grid') {
        this.data.columns.splice(index, 1)
      } else if (this.data.type === 'dropdown') {
        this.data.items.splice(index, 1)
      } else {
        this.data.options.options.splice(index, 1)
      }
    },
    handleAddOption() {
      if (this.data.options.showLabel) {
        this.data.options.options.push({
          value: this.$t('fm.config.widget.newOption'),
          label: this.$t('fm.config.widget.newOption'),
        })
      } else {
        this.data.options.options.push({
          value: this.$t('fm.config.widget.newOption'),
        })
      }
    },
    handleAddColumn() {
      this.data.columns.push({
        cols: null,
        sm: null,
        md: null,
        lg: null,
        xl: null,
        offset: null,
        offsetSm: null,
        offsetMd: null,
        offsetLg: null,
        offsetXl: null,
        order: null,
        orderSm: null,
        orderMd: null,
        orderLg: null,
        orderXl: null,
        alignSelf: null,
        tag: 'div',
        list: [],
      })
    },

    handleAddItem() {
      this.data.items.push({
        text: 'New item',
        disabled: false,
        active: false,
        variant: null,
      })
    },
    handleFieldsRemove(index) {
      this.data.options.fields.splice(index, 1)
    },
    handleAddField() {
      this.data.options.fields.push({
        key: 'new',
        label: 'Nowa kolumna',
        sortable: true,
      })
    },
    generateRule() {
      this.data.rules = []
      Object.keys(this.validator).forEach((key) => {
        if (this.validator[key]) {
          this.data.rules.push(this.validator[key])
        }
      })
    },
    handleSelectMuliple(value) {
      if (value) {
        if (this.data.options.defaultValue) {
          this.data.options.defaultValue = [this.data.options.defaultValue]
        } else {
          this.data.options.defaultValue = []
        }
      } else {
        if (this.data.options.defaultValue.length > 0) {
          this.data.options.defaultValue = this.data.options.defaultValue[0]
        } else {
          this.data.options.defaultValue = ''
        }
      }
    },

    validateRequired(val) {
      if (val) {
        this.validator.required = { required: true, message: `${this.data.name}${this.$t('fm.config.widget.validatorRequired')}` }
      } else {
        this.validator.required = null
      }

      this.$nextTick(() => {
        this.generateRule()
      })
    },

    validateDataType(val) {
      if (!this.show) {
        return false
      }

      if (val) {
        this.validator.type = { type: val, message: this.data.name + this.$t('fm.config.widget.validatorType') }
      } else {
        this.validator.type = null
      }

      this.generateRule()
    },
    valiatePattern(val) {
      if (!this.show) {
        return false
      }

      if (val) {
        this.validator.pattern = { pattern: val, message: this.data.name + this.$t('fm.config.widget.validatorPattern') }
      } else {
        this.validator.pattern = null
      }

      this.generateRule()
    },
  },
  watch: {
    'data.options.isRange': function (val) {
      if (typeof val !== 'undefined') {
        if (val) {
          this.data.options.defaultValue = null
        } else {
          if (Object.keys(this.data.options).indexOf('defaultValue') >= 0) this.data.options.defaultValue = ''
        }
      }
    },
    'data.options.required': function (val) {
      this.validateRequired(val)
    },
    'data.options.dataType': function (val) {
      this.validateDataType(val)
    },
    'data.options.pattern': function (val) {
      this.valiatePattern(val)
    },
    'data.name': function (val) {
      if (this.data.options) {
        this.validateRequired(this.data.options.required)
        this.validateDataType(this.data.options.dataType)
        this.valiatePattern(this.data.options.pattern)
      }
    },
  },
}
</script>
