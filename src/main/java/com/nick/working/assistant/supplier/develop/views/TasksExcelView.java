package com.nick.working.assistant.supplier.develop.views;

import com.nick.working.assistant.supplier.develop.models.Progress;
import com.nick.working.assistant.supplier.develop.models.Task;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.view.document.AbstractXlsxView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;

@Component
public class TasksExcelView extends AbstractXlsxView {

    @Override
    protected void buildExcelDocument(Map<String, Object> map, Workbook workbook, HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws Exception {
        @SuppressWarnings("unchecked")
        List<Task> tasks = (List<Task>) map.get("tasks");

        Sheet sheet = workbook.createSheet();
        sheet.setFitToPage(true);

        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setFillForegroundColor(IndexedColors.YELLOW.index);
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);

        Row header = sheet.createRow(0);

        header.createCell(0).setCellValue("序号");
        header.getCell(0).setCellStyle(headerStyle);
        header.createCell(1).setCellValue("负责人");
        header.getCell(1).setCellStyle(headerStyle);
        header.createCell(2).setCellValue("供应商全称");
        header.getCell(2).setCellStyle(headerStyle);
        header.createCell(3).setCellValue("供应商类型");
        header.getCell(3).setCellStyle(headerStyle);
        header.createCell(4).setCellValue("品类");
        header.getCell(4).setCellStyle(headerStyle);
        header.createCell(5).setCellValue("任务类型");
        header.getCell(5).setCellStyle(headerStyle);
        header.createCell(6).setCellValue("备注");
        header.getCell(6).setCellStyle(headerStyle);
        header.createCell(7).setCellValue("昨日进度");
        header.getCell(7).setCellStyle(headerStyle);

        CellStyle todayHeaderStyle = workbook.createCellStyle();
        todayHeaderStyle.setFillForegroundColor(IndexedColors.RED.index);
        todayHeaderStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        todayHeaderStyle.setFont(headerFont);

        header.createCell(8).setCellValue("当前进度");
        header.getCell(8).setCellStyle(todayHeaderStyle);

        for (int i = 0; i < tasks.size(); i++) {
            Task task = tasks.get(i);
            Row row = sheet.createRow(i + 1);
            row.createCell(0).setCellValue(i + 1);
            row.createCell(1).setCellValue(task.getOwner().getName());
            row.createCell(2).setCellValue(task.getSupplierName());
            row.createCell(3).setCellValue(task.getSupplierType());
            row.createCell(4).setCellValue(task.getSubtype());
            row.createCell(5).setCellValue(task.getType());
            row.createCell(6).setCellValue(task.getDescription());
            Progress py = task.getStatusOfYesterday();
            if (py != null) {
                row.createCell(7).setCellValue(py.getDetailText());
            }
            Progress pt = task.getStatusOfToday();
            if (pt != null) {
                row.createCell(8).setCellValue(pt.getDetailText());
            } else {
                row.createCell(8).setCellValue("尚未更新");
                Font font = workbook.createFont();
                font.setColor(IndexedColors.RED.index);
                CellStyle style = workbook.createCellStyle();
                style.setFont(font);
                row.getCell(8).setCellStyle(style);
            }
        }

        httpServletResponse.setHeader("Content-Disposition", "attachment; filename=tasks.xlsx");
    }
}
