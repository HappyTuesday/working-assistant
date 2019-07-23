package com.nick.working.assistant.supplier.develop.views;

import com.nick.working.assistant.supplier.develop.models.Progress;
import com.nick.working.assistant.supplier.develop.models.Task;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.view.document.AbstractXlsxView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;

@Component
public class TasksExcelView extends AbstractXlsxView {

    private static final SimpleDateFormat DATE_FORMAT_IN_MINUTES = new SimpleDateFormat("yyyy-MM-dd HH:mm");

    @Override
    protected void buildExcelDocument(Map<String, Object> map, Workbook workbook, HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws Exception {
        @SuppressWarnings("unchecked")
        List<Task> tasks = (List<Task>) map.get("tasks");

        Sheet sheet = workbook.createSheet();
        sheet.setFitToPage(true);

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("任务编号");
        header.createCell(1).setCellValue("负责人");
        header.createCell(2).setCellValue("供应商全称");
        header.createCell(3).setCellValue("供应商类型");
        header.createCell(4).setCellValue("品类");
        header.createCell(5).setCellValue("任务类型");
        header.createCell(6).setCellValue("备注");
        header.createCell(7).setCellValue("昨日进度");
        header.createCell(8).setCellValue("当前进度");
        header.createCell(9).setCellValue("是否已结束");
        header.createCell(10).setCellValue("结束时间");

        for (int i = 0; i < tasks.size(); i++) {
            Task task = tasks.get(i);
            Row row = sheet.createRow(i + 1);
            row.createCell(0).setCellValue("#" + task.getId());
            row.createCell(1).setCellValue(task.getOwner().getName());
            row.createCell(2).setCellValue(task.getSupplierName());
            row.createCell(3).setCellValue(task.getSupplierType());
            row.createCell(4).setCellValue(task.getSubtype());
            row.createCell(5).setCellValue(task.getType());
            row.createCell(6).setCellValue(task.getDescription());
            Progress py = task.getStatusOfYesterday();
            if (py != null) {
                row.createCell(7).setCellValue(py.getContent());
            }
            Progress pt = task.getStatusOfToday();
            if (pt != null) {
                row.createCell(8).setCellValue(pt.getContent());
            }
            row.createCell(9).setCellValue(task.isDone() ? "是" : "否");
            if (task.getDoneTime() != null) {
                row.createCell(10).setCellValue(DATE_FORMAT_IN_MINUTES.format(task.getDoneTime()));
            }
        }

        httpServletResponse.setHeader("Content-Disposition", "attachment; filename=tasks.xlsx");
    }
}
