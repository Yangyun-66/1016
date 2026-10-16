"use strict";

const dateElement = document.getElementById("today-date");
const scheduleList = document.getElementById("schedule-list");
const scheduleForm = document.getElementById("schedule-form");
const formMessage = document.getElementById("form-message");

function formatToday(date) {
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
}

function updateScheduleCount() {
  const count = scheduleList.querySelectorAll(".schedule-item").length;
  document.getElementById("schedule-count").textContent = String(count);
  document.getElementById("schedule-heading-count").textContent = `${count} 項行程`;
}

function createScheduleItem(title, time, category) {
  const item = document.createElement("article");
  item.className = "schedule-item";

  const timeElement = document.createElement("time");
  timeElement.className = "schedule-time";
  timeElement.dateTime = time;
  timeElement.textContent = time;

  const marker = document.createElement("span");
  marker.className = "timeline-marker";
  marker.setAttribute("aria-hidden", "true");

  const details = document.createElement("div");
  details.className = "schedule-details";
  const heading = document.createElement("h3");
  heading.textContent = title;
  const description = document.createElement("p");
  description.textContent = "新增的行程安排";
  details.append(heading, description);

  const tag = document.createElement("span");
  tag.className = `schedule-tag ${category === "工作" ? "tag-work" : "tag-personal"}`;
  tag.textContent = category;

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-schedule-button";
  deleteButton.type = "button";
  deleteButton.textContent = "刪除";
  deleteButton.setAttribute("aria-label", `刪除行程：${title}`);

  item.append(timeElement, marker, details, tag, deleteButton);
  return item;
}

function sortSchedulesByTime() {
  const items = Array.from(scheduleList.querySelectorAll(".schedule-item"));
  items.sort((first, second) => {
    const firstTime = first.querySelector(".schedule-time").dateTime;
    const secondTime = second.querySelector(".schedule-time").dateTime;
    return firstTime.localeCompare(secondTime);
  });
  items.forEach((item) => scheduleList.append(item));
}

dateElement.textContent = formatToday(new Date());
dateElement.dateTime = new Date().toISOString().slice(0, 10);
updateScheduleCount();

scheduleList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-schedule-button");
  if (!deleteButton) return;

  const scheduleItem = deleteButton.closest(".schedule-item");
  const title = scheduleItem.querySelector(".schedule-details h3").textContent;
  scheduleItem.remove();
  updateScheduleCount();
  formMessage.textContent = `已刪除「${title}」行程。`;
});

scheduleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!scheduleForm.reportValidity()) return;

  const formData = new FormData(scheduleForm);
  const title = String(formData.get("title")).trim();
  const time = String(formData.get("time"));
  const category = String(formData.get("category"));
  if (!title || !time) return;

  scheduleList.append(createScheduleItem(title, time, category));
  sortSchedulesByTime();
  updateScheduleCount();
  formMessage.textContent = `已新增「${title}」行程。`;
  scheduleForm.reset();
});
