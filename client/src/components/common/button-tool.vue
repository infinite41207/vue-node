<template>
    <b-row class="align-items-center toggle-btns-group m-1 flex-nowrap">
        <div v-for="item in data" v-bind:key="item.label" class="hideable-btn">
            <b-button v-if="!item.type" :variant="item.variant" class="mr-1" size="sm"
                :class="item.rect > innerWidth ? 'd-none' : ''" :rect="item.rect">
                    <i :class="item.icon + ' mr-1'"></i>
                {{ item.label }}
            </b-button>
            <b-dropdown v-if="item.type === 'dropdown'"  :rect="item.rect" :variant="item.variant" :text="item.label" size="sm"
                :class="item.rect > innerWidth ? 'd-none' : ''" class="mr-1">
                <b-dropdown-item v-for="child in item.items" v-bind:key="child.label">
                    {{ child.label }}
                </b-dropdown-item>
            </b-dropdown>
        </div>
        <b-dropdown variant="outline-secondary" size="sm" id="more-btn" :text="$t('commands.more')">
            <b-dropdown-item v-for="(dropItem, i) in data" v-bind:key="dropItem.label + i">
                <span  :class="dropItem.rect < innerWidth ? 'd-none' : ''">{{ dropItem.label }}</span>
            </b-dropdown-item>
        </b-dropdown>
    </b-row>
</template>

<script>
export default {
    props: ['data'],
    data() {
        return {
            // buttons: this.data
            innerWidth: window.innerWidth
        }
    },
    created() {
        window.addEventListener('resize', this.handleResize);
    },
    mounted() {
        this.$nextTick(function () {
            this.updateData()
        })
    },
    methods: {
        updateData() {
            const group = document.querySelector('.toggle-btns-group')
            const buttons = []
            const hideableBtns = group.querySelectorAll('.hideable-btn')
            for (let i = 0; i < this.data.length; i++) {
                const rect = hideableBtns[i].getBoundingClientRect()
                this.data[i].rect = rect.right + 130
                buttons.push(this.data[i])
            }
            this.data = buttons
        },
        handleResize() {
            if (window.innerWidth >= 375) {
                this.innerWidth = window.innerWidth
            }
        }
    },
}
</script>

<style lang="scss">
// .toggle-btns-group {
//     .hideable-btn {
//         &:first-child {
//             button {
//                 display: block !important;
//             }
//         }
//         button {
//             white-space: nowrap;
//         }
//     }

//     .dropdown {
//         .dropdown-item {
//             padding: 0;

//             span {
//                 display: block;
//                 padding: 0.375rem 1.5rem;
//             }
//         }
//     }
// }
</style>