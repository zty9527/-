import { GoogleGenAI } from "@google/genai";
import { SystemLog } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSecurityAudit = async (logs: SystemLog[]): Promise<string> => {
  try {
    const logsText = logs.map(l => `[${l.timestamp}] [${l.level}] ${l.actor}: ${l.action} - ${l.details}`).join('\n');
    
    const prompt = `
      作为一名警用数字证书系统的安全审计专家，请根据以下系统日志生成一份简要的安全审计报告。
      
      日志内容:
      ${logsText}
      
      要求:
      1. 使用专业的警务和信息安全术语。
      2. 总结主要的安全风险（如发现）。
      3. 对"WARNING"和"CRITICAL"级别的事件提供具体建议。
      4. 格式清晰，分点陈述。
      5. 输出格式为Markdown。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "无法生成报告，请稍后重试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "生成审计报告时发生错误。请检查网络连接或API配置。";
  }
};