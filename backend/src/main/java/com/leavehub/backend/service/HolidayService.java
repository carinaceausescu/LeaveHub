package com.leavehub.backend.service;

import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.Month;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class HolidayService {

    private final Map<Integer, Set<LocalDate>> cachePerYear = new ConcurrentHashMap<>();

    public int calculateWorkingDays(LocalDate start, LocalDate end) {
        int count = 0;
        LocalDate date = start;
        while (!date.isAfter(end)) {
            if (isWorkingDay(date)) {
                count++;
            }
            date = date.plusDays(1);
        }
        return count;
    }

    public boolean isWorkingDay(LocalDate date) {
        return date.getDayOfWeek() != DayOfWeek.SATURDAY
                && date.getDayOfWeek() != DayOfWeek.SUNDAY
                && !isLegalHoliday(date);
    }

    public boolean isLegalHoliday(LocalDate date) {
        return legalHolidays(date.getYear()).contains(date);
    }

    public Set<LocalDate> legalHolidays(int year) {
        return cachePerYear.computeIfAbsent(year, HolidayService::buildHolidays);
    }

    private static Set<LocalDate> buildHolidays(int year) {
        Set<LocalDate> holidays = new HashSet<>();

        holidays.add(LocalDate.of(year, Month.JANUARY, 1));    // Anul Nou
        holidays.add(LocalDate.of(year, Month.JANUARY, 2));    // Anul Nou
        holidays.add(LocalDate.of(year, Month.JANUARY, 6));    // Boboteaza
        holidays.add(LocalDate.of(year, Month.JANUARY, 7));    // Sfantul Ioan Botezatorul
        holidays.add(LocalDate.of(year, Month.JANUARY, 24));   // Unirea Principatelor Romane
        holidays.add(LocalDate.of(year, Month.MAY, 1));        // Ziua Muncii
        holidays.add(LocalDate.of(year, Month.JUNE, 1));       // Ziua Copilului
        holidays.add(LocalDate.of(year, Month.AUGUST, 15));    // Adormirea Maicii Domnului
        holidays.add(LocalDate.of(year, Month.NOVEMBER, 30));  // Sfantul Andrei
        holidays.add(LocalDate.of(year, Month.DECEMBER, 1));   // Ziua Nationala
        holidays.add(LocalDate.of(year, Month.DECEMBER, 25));  // Craciun
        holidays.add(LocalDate.of(year, Month.DECEMBER, 26));  // Craciun

        LocalDate easter = orthodoxEaster(year);
        holidays.add(easter.minusDays(2));  // Vinerea Mare
        holidays.add(easter);               // Prima zi de Paste
        holidays.add(easter.plusDays(1));   // A doua zi de Paste
        holidays.add(easter.plusDays(49));  // Rusalii
        holidays.add(easter.plusDays(50));  // A doua zi de Rusalii

        return Set.copyOf(holidays);
    }

    static LocalDate orthodoxEaster(int year) {
        int a = year % 4;
        int b = year % 7;
        int c = year % 19;
        int d = (19 * c + 15) % 30;
        int e = (2 * a + 4 * b - d + 34) % 7;
        int month = (d + e + 114) / 31;
        int day = ((d + e + 114) % 31) + 1;

        return LocalDate.of(year, month, day).plusDays(13);
    }
}
