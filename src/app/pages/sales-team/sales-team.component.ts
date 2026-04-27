import { Component, inject, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sales-team',
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-team.component.html',
  styleUrl: './sales-team.component.scss'
})
export class SalesTeamComponent implements OnInit {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);

  activeTab = 'profiles';
  showForm = false;
  editingName: string | null = null;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });
  }

  targets = [
    { name: 'Keith DeRuiter', area: 'East', q1Target: 75, q1Achieved: 69, q2Target: 80, q2Achieved: 26, ytdTarget: 310, ytdAchieved: 95 },
    { name: 'Lisa Volomino', area: 'East', q1Target: 50, q1Achieved: 61, q2Target: 55, q2Achieved: 8, ytdTarget: 210, ytdAchieved: 69 },
    { name: 'Chuck Gaetano', area: 'North Central', q1Target: 80, q1Achieved: 60, q2Target: 85, q2Achieved: 12, ytdTarget: 330, ytdAchieved: 72 },
    { name: 'Amanda Rippy', area: 'North Central', q1Target: 65, q1Achieved: 40, q2Target: 70, q2Achieved: 5, ytdTarget: 270, ytdAchieved: 45 },
    { name: 'Alexandra Maddalozzo', area: 'Southwest', q1Target: 60, q1Achieved: 42, q2Target: 65, q2Achieved: 9, ytdTarget: 250, ytdAchieved: 51 }
  ];
  
  newMember: any = {
    name: '',
    position: '',
    areaId: '',
    area: '',
    product: 'Anktiva 400mcg/0.4mL',
    allTeamMark: 'Y',
    glbNcl: 'N',
    leadershipTeam: 'N',
    ariTeam: 'N'
  };

  get team() {
    return this.dataService.getSalesTeam();
  }

  addMember() {
    if (this.editingName) {
      const member = this.team.find(x => x.name === this.editingName);
      if (member) {
        Object.assign(member, this.newMember);
      }
    } else {
      this.dataService.addTeamMember({ ...this.newMember });
    }
    this.closeForm();
  }

  editMember(member: any) {
    this.editingName = member.name;
    this.newMember = { ...member };
    this.showForm = true;
  }

  deleteMember(name: string) {
    this.dataService.deleteTeamMember(name);
  }

  closeForm() {
    this.showForm = false;
    this.editingName = null;
    this.newMember = { name: '', position: '', areaId: '', area: '', product: 'Anktiva 400mcg/0.4mL', allTeamMark: 'Y', glbNcl: 'N', leadershipTeam: 'N', ariTeam: 'N' };
  }
}
