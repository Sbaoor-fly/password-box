<template>
    <el-dialog :model-value="visible" @update:model-value="emit('update:visible', $event)" @open="onOpen"
        :title="dialogTitle" width="90%" :style="{ maxWidth: '700px' }" destroy-on-close>
        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
            <el-form-item label="标题" prop="title">
                <el-input v-model="formData.title" placeholder="例如：社交媒体账号"></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
                <el-select v-model="formData.icon" placeholder="请选择一个图标" style="width: 100%">
                    <el-option v-for="iconName in iconOptions" :key="iconName" :label="iconName" :value="iconName">
                        <el-icon style="margin-right: 8px;">
                            <component :is="iconName" />
                        </el-icon>
                        <span>{{ iconName }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="notes">
                <el-input v-model="formData.notes" type="textarea" :rows="3" placeholder="可以输入一些额外信息"></el-input>
            </el-form-item>
            <el-divider content-position="left">字段 (KV对)</el-divider>
            <div v-for="(field, index) in formData.items" :key="index" class="kv-item">
                <el-form-item :label="'字段 ' + (index + 1)" :prop="'items.' + index + '.key'"
                    :rules="{ required: true, message: 'Key 不能为空', trigger: 'blur' }">
                    <el-input v-model="field.key" placeholder="Key (例如：用户名)"></el-input>
                </el-form-item>
                <el-form-item label-width="0" :prop="'items.' + index + '.value'">
                    <el-input v-model="field.value" placeholder="Value (例如：my_username)"></el-input>
                </el-form-item>
                <el-button type="danger" :icon="Delete" circle @click="removeKeyValueField(index)" />
            </div>
            <el-form-item>
                <el-button type="primary" plain @click="addKeyValueField">
                    <el-icon style="margin-right: 4px;">
                        <Plus />
                    </el-icon>添加字段
                </el-button>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="emit('update:visible', false)">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确认</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Delete } from '@element-plus/icons-vue';

const props = defineProps({
    visible: Boolean,
    itemToEdit: { type: Object, default: null },
});
const emit = defineEmits(['update:visible', 'save-item']);

const formRef = ref(null);
const formData = ref({});
const iconOptions = ref(['Link', 'Platform', 'Connection', 'Coin', 'User', 'Lock', 'Key', 'Message', 'Shop', 'Setting', 'CreditCard']);

const dialogTitle = computed(() => props.itemToEdit ? '编辑项目' : '新增项目');

const getInitialFormState = () => ({ title: '', icon: '', notes: '', items: [{ key: '', value: '' }] });

watch(() => props.itemToEdit, (newItem) => {
    if (newItem) {
        formData.value = JSON.parse(JSON.stringify(newItem));
    }
});

const onOpen = () => {
    if (!props.itemToEdit) {
        formData.value = getInitialFormState();
    }
};

const formRules = {
    title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
    icon: [{ required: true, message: '请选择一个图标', trigger: 'change' }],
};

const addKeyValueField = () => { formData.value.items.push({ key: '', value: '' }); };
const removeKeyValueField = (index) => {
    if (formData.value.items.length > 1) formData.value.items.splice(index, 1);
    else ElMessage.warning('至少需要保留一个字段');
};

const handleSubmit = async () => {
    if (!formRef.value) return;
    await formRef.value.validate((valid) => {
        if (valid) {
            emit('save-item', formData.value);
            emit('update:visible', false);
        } else { ElMessage.error('请检查表单是否填写完整'); }
    });
};
</script>

<style scoped>
.kv-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 18px;
}

.kv-item .el-form-item {
    flex-grow: 1;
    margin-bottom: 0;
}

.kv-item .el-button {
    margin-top: 5px;
}
</style>